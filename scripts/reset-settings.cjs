// Reset all site settings back to defaults (clears the settings overrides).
const D = require("better-sqlite3");
const db = new D("./data/convertly.db");
const n = db.prepare("DELETE FROM settings").run();
console.log("settings cleared:", n.changes, "rows removed — site back to defaults.");
