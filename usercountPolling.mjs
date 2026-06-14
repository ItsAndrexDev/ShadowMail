import { writeFile } from "fs";
import Database from "better-sqlite3";
const db = new Database("shadowmail.db");

const countQuery = db.prepare('SELECT COUNT(*) AS total FROM users');

export default async function updateUsercount() {
    for(;;) {
        const result = countQuery.get();
        const countString = result.total.toString();
        try {
            await writeFile("usercount.txt",countString);
        } catch(err) {
            console.log(err);
        }
        await new Promise((r) => setTimeout(r, 0.5*1000*60*60));
    }
}