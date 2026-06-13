import Database from 'better-sqlite3';
import 'dotenv/config'
import imaps from "imap-simple";
const IMAP_CONFIG = {
    imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASS,
        host: process.env.HOST,
        port: 993,
        tls: true,
        authTimeout: 3000,
        tlsOptions: {
            rejectUnauthorized: false,
        },
    },
};

try {
    const db = new Database(':memory:'); 
    console.log("✅ Database module loaded and initialized!");

    const connection = await imaps.connect(IMAP_CONFIG);
    console.log("✅ IMAP connected");
    process.exit(0);
} catch (e) {
    console.error("❌ Test failed: " + e.message);
    process.exit(1);
}