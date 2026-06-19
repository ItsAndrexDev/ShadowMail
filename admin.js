const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { SqliteGuiNodeMiddleware } = require("sqlite-gui-node");

const PORT = 8082;
const adminApp = express();
// Point this to your existing SQLite file
const db = new sqlite3.Database("./shadowmail.db"); 

// Pass your admin app instance and database connection
adminApp.use(SqliteGuiNodeMiddleware(adminApp, db));

adminApp.listen(PORT, () => {
  console.log(`database manager running at http://localhost:${PORT}/home`);
});