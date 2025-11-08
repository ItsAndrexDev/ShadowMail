import imaps, { connect } from "imap-simple";
import { simpleParser } from "mailparser";
import Database from "better-sqlite3";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import juice from "juice";
import cfg from "./config.mjs";
const db = new Database("shadowmail.db");
const config = {
    imap: {
        user: cfg.USER,
        password: cfg.PASSWORD, // Gmail app password
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: {
            rejectUnauthorized: false,
        },
    },
};
try {
  const connection = await imaps.connect(config);
  console.log('✅ Connected!');
  await connection.end();
} catch (err) {
  console.error('❌ IMAP error:', err);
}
async function readMessages(connection) {
    try {
        await connection.openBox("[Gmail]/All Mail");
        const searchCriteria = ["UNSEEN"];
        const fetchOptions = { bodies: [""] };
        const messages = await connection.search(searchCriteria, fetchOptions);
        for (const item of messages) {
            const raw = item.parts[0].body;
            const parsed = await simpleParser(raw);
            const emailfrom = parsed.from.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const emailto = parsed.to.text.match(/\d+(?=@shadowmail\.win)/);
            if (!emailto) return; console.log(`✅Pushed email from ${emailfrom} to DB!`);

            const htmlBody = parsed.html || parsed.textAsHtml;
            const window = new JSDOM('').window;
            const DOMPurify = createDOMPurify(window);
            let cleanHtml = DOMPurify.sanitize(htmlBody);

            cleanHtml = juice(cleanHtml); db.prepare("INSERT INTO mail (address_id, sender, subject, body) VALUES (?, ?, ?, ?)").run(emailto, emailfrom, parsed.subject, cleanHtml);
            await connection.addFlags(item.attributes.uid, "\\Seen");
        }
    } catch (err) { console.error("❌ Error reading emails:", err); }
}

async function deleteRead(connection) {
    try {
        await connection.openBox("[Gmail]/All Mail");

        const searchCriteria = ["SEEN"];
        const fetchOptions = { bodies: [""], markSeen: false };

        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length !== 0) {
            for (const item of messages) {
                const uid = item.attributes.uid;
                await connection.addFlags(uid, "\\Deleted");
            }
            console.log("✅ All read emails deleted!");
        }
    } catch (err) {
        console.error("❌ Error deleting emails:", err);
    }
}

export default async function parseMails() {
    console.log("⏳ Checking for emails every 2 seconds...\n");
    while (true) {
        let connection;
        try {
            connection = await imaps.connect(config);
            await readMessages(connection);
        } catch (err) {
            console.error("❌ Main loop error:", err);
        } finally {
            if (connection) connection.end();
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
}