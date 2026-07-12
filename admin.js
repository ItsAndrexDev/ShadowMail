import express from "express"
import sqlite3 from "sqlite3"
import { SqliteGuiNodeMiddleware } from "sqlite-gui-node"; 
const PORT = 8082;
const HOST = "0.0.0.0";
const adminApp = express();
const db = new sqlite3.Database("./shadowmail.db");

adminApp.use(SqliteGuiNodeMiddleware(adminApp, db));

adminApp.listen(PORT, HOST, () => {
  console.log(`database manager running at http://192.168.1.20:${PORT}/home`);
});