import express from express
import sqlite3 from sqlite3.verbose()
import { SqliteGuiNodeMiddleware } from "sqlite-gui-node";

const PORT = 8082;
const adminApp = express();
const db = new sqlite3.Database("./shadowmail.db"); 

adminApp.use(SqliteGuiNodeMiddleware(adminApp, db));

adminApp.listen(PORT, () => {
  console.log(`database manager running at http://localhost:${PORT}/home`);
});