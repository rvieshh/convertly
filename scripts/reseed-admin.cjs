// One-off: re-hash the default admin password from a quoted .env value.
const fs = require("fs");
const env = {};
for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) {
    let v = m[2];
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    env[m[1]] = v;
  }
}
const b = require("bcryptjs");
const D = require("better-sqlite3");
const db = new D("./data/convertly.db");
const h = b.hashSync(env.ADMIN_DEFAULT_PASSWORD, 12);
const t = Date.now();
const existing = db.prepare("SELECT id FROM admin WHERE id = 1").get();
if (existing) {
  db.prepare("UPDATE admin SET username=?, email=?, password_hash=?, must_change=1, updated_at=? WHERE id=1")
    .run(env.ADMIN_DEFAULT_USERNAME, env.ADMIN_DEFAULT_EMAIL, h, t);
} else {
  db.prepare("INSERT INTO admin(id,username,email,password_hash,must_change,created_at,updated_at) VALUES(1,?,?,?,1,?,?)")
    .run(env.ADMIN_DEFAULT_USERNAME, env.ADMIN_DEFAULT_EMAIL, h, t, t);
}
console.log("admin password re-hashed. verify Convertly#1234 ->", b.compareSync("Convertly#1234", h));
