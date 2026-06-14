import { writeFile } from "fs/promises";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "usercount.txt");

const db = new Database("shadowmail.db");
const countQuery = db.prepare('SELECT COUNT(*) AS total FROM users');

export default async function updateUsercount() {
    for(;;) {
        const result = countQuery.get();
        try {
            await writeFile(filePath, result.total.toString());
        } catch(err) {
            console.error('Polling error:', err);
        }
        await new Promise((r) => setTimeout(r, 0.5 * 1000 * 60 * 60));
    }
}