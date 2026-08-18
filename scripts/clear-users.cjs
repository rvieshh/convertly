// Clear test user accounts created during development.
const D = require("better-sqlite3");
const db = new D("./data/convertly.db");
const n = db.prepare("DELETE FROM users").run();
console.log("test users removed:", n.changes);
