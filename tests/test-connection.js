import Database from 'better-sqlite3';
import 'dotenv/config'
import imaps from "imap-simple";
import { readFileSync } from 'fs';
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
    const connection = await imaps.connect(IMAP_CONFIG);
    console.log("✅ IMAP connected");
    
    const db = new Database('shadowmail.db'); 
    db.pragma("foreign_keys = ON");
    
    const schema = readFileSync('./schema.sql', 'utf8');
    db.exec(schema);

    console.log("✅ Database module loaded and initialized!");

    process.exit(0);
} catch (e) {
    console.error("❌ Test failed: " + e.message);
    process.exit(1);
}