// parseMails.mjs

import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import Database from "better-sqlite3";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import juice from "juice";
import cfg from "./config.mjs";

const db = new Database("shadowmail.db");

const IMAP_CONFIG = {
    imap: {
        user: cfg.USER,
        password: cfg.PASSWORD,
        host: cfg.HOST,
        port: 993,
        tls: true,
        authTimeout: 10000,
        tlsOptions: { rejectUnauthorized: false },
    },
};

const POLL_INTERVAL_MS = 10000; // Increased to 10s to prevent IMAP rate-limiting
const SEARCH_TIMEOUT_MS = 25000; // Increased to give IMAP searches enough time

function withTimeout(promise, ms, label) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout: "${label}" exceeded ${ms}ms`)), ms)
    );
    return Promise.race([promise, timeout]);
}

async function readMessages(connection) {
    // Search directly assuming box is already open, or wrap opening cleanly
    const searchCriteria = ["UNSEEN"];
    const fetchOptions = { bodies: [""], markSeen: true };

    const messages = await withTimeout(
        connection.search(searchCriteria, fetchOptions),
        SEARCH_TIMEOUT_MS,
        "imap search"
    );

    if (!messages || messages.length === 0) return;

    for (const item of messages) {
        try {
            const raw = item.parts[0].body;
            const parsed = await simpleParser(raw);

            const emailto = parsed.to?.text.match(/\b([0-9]+@shadowmail\.win)\b/);
            if (!emailto) continue;

            if (!parsed.from?.text) {
                await connection.deleteMessage(item.attributes.uid);
                continue;
            }

            const emailfrom = parsed.from.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (!emailfrom) {
                await connection.deleteMessage(item.attributes.uid);
                continue;
            }

            const addressId = parseInt(emailto[1], 10);
            const sender = emailfrom[0];

            const addressRow = db.prepare("SELECT id FROM address WHERE id = ?").get(addressId);
            if (!addressRow) {
                await connection.deleteMessage(item.attributes.uid);
                continue;
            }

            const htmlBody = parsed.html || parsed.textAsHtml || "<p>(no content)</p>";
            const window = new JSDOM("").window;
            const DOMPurify = createDOMPurify(window);
            const cleanHtml = juice(DOMPurify.sanitize(htmlBody));

            db.prepare(
                "INSERT INTO mail (address_id, sender, subject, body) VALUES (?, ?, ?, ?)"
            ).run(addressId, sender, parsed.subject ?? "(no subject)", cleanHtml);

            await connection.deleteMessage(item.attributes.uid);
            console.log(`✅ Stored email from ${sender} → ${addressId}`);
        } catch (itemErr) {
            console.error("❌ Failed to process message:", itemErr.message);
        }
    }
}

async function connectWithRetry() {
    while (true) {
        try {
            const connection = await imaps.connect(IMAP_CONFIG);
            await connection.openBox("INBOX");
            console.log("✅ IMAP connected and INBOX opened");
            return connection;
        } catch (err) {
            console.error("❌ IMAP connection failed, retrying in 5s...", err.message);
            await new Promise((r) => setTimeout(r, 5000));
        }
    }
}

export default async function parseMails() {
    console.log("⏳ Checking for emails...");
    let connection = await connectWithRetry();

    while (true) {
        try {
            await readMessages(connection);
        } catch (err) {
            console.error("❌ Error during mail fetch — reconnecting...", err.message);
            try { connection.end(); } catch (_) {}
            connection = await connectWithRetry();
        }

        // Wait for interval before next poll cycle
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
}