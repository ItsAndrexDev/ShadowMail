import Database from 'better-sqlite3';

try {
  const db = new Database(':memory:'); 
  console.log("✅ Database module loaded and initialized!");
  process.exit(0);
} catch (e) {
  console.error("❌ Test failed: " + e.message);
  process.exit(1);
}