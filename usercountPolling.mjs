import { writeFile } from "fs";
import Database from "better-sqlite3";
import path from "path";
const db = new Database("shadowmail.db");

const countQuery = db.prepare('SELECT COUNT(*) AS total FROM users');

export default async function updateUsercount() {
    for(;;) {
        const result = countQuery.get();
        const countString = result.total.toString();
        try {
            const filePath = path.join(__dirname, "usercount.txt")
            await writeFile(filePath,countString);
        } catch(err) {
            console.log(err);
        }
        await new Promise((r) => setTimeout(r, 0.5*1000*60*60));
    }
}