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
        authTimeout: 3000,
        tlsOptions: {
            rejectUnauthorized: false,
        },
    },
};

const POLL_INTERVAL_MS     = 2000;
const READ_TIMEOUT_MS      = 15000;
const SEARCH_TIMEOUT_MS    = 10000;
const DELETE_TIMEOUT_MS    = 10000;
const KEEPALIVE_INTERVAL_MS = 30000;
const RECONNECT_EVERY      = 300; // reconnect every ~10 minutes (300 × 2s polls)

// ─── Utility ────────────────────────────────────────────────────────────────

function withTimeout(promise, ms, label) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout: "${label}" exceeded ${ms}ms`)), ms)
    );
    return Promise.race([promise, timeout]);
}

// Marks a message \Deleted and expunges it so it's actually removed from
// the server, not just flagged. imap-simple's deleteMessage() handles both
// steps. Wrapped in withTimeout so a hung delete can't stall the batch,
// and wrapped in try/catch so a delete failure doesn't take down the loop.
async function deleteMessage(connection, uid) {
    try {
        await withTimeout(
            connection.deleteMessage(uid),
            DELETE_TIMEOUT_MS,
            "imap deleteMessage"
        );
    } catch (delErr) {
        console.error(`❌ Failed to delete message uid ${uid} from server:`, delErr.message);
    }
}

// ─── Core mail reader ────────────────────────────────────────────────────────

async function readMessages(connection) {
    await connection.openBox("INBOX");

    const searchCriteria = ["UNSEEN"];
    const fetchOptions   = { bodies: [""] };

    const messages = await withTimeout(
        connection.search(searchCriteria, fetchOptions),
        SEARCH_TIMEOUT_MS,
        "imap search"
    );

    if (messages.length === 0) return;

    for (const item of messages) {
        try {
            const raw    = item.parts[0].body;
            const parsed = await simpleParser(raw);

            // Use flexible match — parsed.to.text may include display names e.g. "John <123@shadowmail.win>"
            const emailto = parsed.to?.text.match(/\b([0-9]+@shadowmail\.win)\b/);
            if (!emailto) {
                console.log(`⏭️  Skipping — no shadowmail recipient in: ${parsed.to?.text}`);
                continue;
            }

            // Guard against missing sender
            if (!parsed.from?.text) {
                console.warn("⚠️  Skipping — email has no sender");
                await deleteMessage(connection, item.attributes.uid);
                continue;
            }

            const emailfrom = parsed.from.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (!emailfrom) {
                console.warn(`⚠️  Skipping — couldn't parse sender address from: ${parsed.from.text}`);
                await deleteMessage(connection, item.attributes.uid);
                continue;
            }

            const addressId = parseInt(emailto[1], 10);
            const sender    = emailfrom[0];

            // Verify the address actually exists in the DB before inserting —
            // avoids SQLITE_CONSTRAINT_FOREIGNKEY when mail arrives for an
            // expired/non-existent shadowmail address.
            const addressRow = db.prepare("SELECT id FROM address WHERE id = ?").get(addressId);
            if (!addressRow) {
                console.warn(`⚠️  Skipping — address ${addressId} not found in DB (expired or never existed)`);
                await deleteMessage(connection, item.attributes.uid);
                continue;
            }

            const htmlBody  = parsed.html || parsed.textAsHtml || "<p>(no content)</p>";
            const window    = new JSDOM("").window;
            const DOMPurify = createDOMPurify(window);
            const cleanHtml = juice(DOMPurify.sanitize(htmlBody));

            db.prepare(
                "INSERT INTO mail (address_id, sender, subject, body) VALUES (?, ?, ?, ?)"
            ).run(addressId, sender, parsed.subject ?? "(no subject)", cleanHtml);

            // Stored locally — now remove it from the IMAP server entirely.
            await deleteMessage(connection, item.attributes.uid);

            console.log(`✅ Stored email from ${sender} → ${addressId} (removed from server)`);
        } catch (itemErr) {
            // Don't let one bad email kill the whole batch
            console.error("❌ Failed to process a message, skipping:", itemErr.message);
        }
    }
}

// ─── Connection ──────────────────────────────────────────────────────────────

async function connectWithRetry() {
    while (true) {
        try {
            const connection = await imaps.connect(IMAP_CONFIG);
            console.log("✅ IMAP connected");
            return connection;
        } catch (err) {
            console.error("❌ IMAP connection failed, retrying in 5s...", err.message);
            await new Promise((r) => setTimeout(r, 5000));
        }
    }
}




function startKeepalive(getConnection) {
    return setInterval(() => {
        const conn = getConnection();
        conn?.imap?.noop?.((err) => {
            if (err) console.warn("⚠️  NOOP failed:", err.message);
        });
    }, KEEPALIVE_INTERVAL_MS);
}

// ─── Main loop ───────────────────────────────────────────────────────────────

export default async function parseMails() {
    console.log("⏳ Checking for emails every 2 seconds...\n");

    let connection   = await connectWithRetry();
    let pollCount    = 0;
    let keepalive    = startKeepalive(() => connection);

    while (true) {
        try {
            await withTimeout(readMessages(connection), READ_TIMEOUT_MS, "readMessages");
            console.log("checking emails...");
        } catch (err) {
            console.error("❌ Error or timeout — reconnecting...", err.message);
            clearInterval(keepalive);
            try { await connection.end(); } catch (_) {}
            connection = await connectWithRetry();
            keepalive  = startKeepalive(() => connection);
            pollCount  = 0;
        }

        // Periodic proactive reconnect to prevent silent stale connections
        pollCount++;
        if (pollCount >= RECONNECT_EVERY) {
            console.log("🔄 Scheduled reconnect...");
            clearInterval(keepalive);
            try { await connection.end(); } catch (_) {}
            connection = await connectWithRetry();
            keepalive  = startKeepalive(() => connection);
            pollCount  = 0;
        }

        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
}
