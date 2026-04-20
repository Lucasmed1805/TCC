const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const dbPath = path.join(__dirname, "tcc.json");
const adapter = new FileSync(dbPath);
const db = low(adapter);

function getDB() {
  return db;
}

async function initDB() {
  const uploadsDir = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  db.defaults({ usuarios: [], tccs: [], solicitacoes: [] }).write();

  const adminExiste = db.get("usuarios").find({ email: "admin@ceep.com" }).value();
  if (!adminExiste) {
    const hash = bcrypt.hashSync("admin123", 10);
    db.get("usuarios").push({
      id: uuidv4(),
      nome: "Administrador Lucas",
      email: "admin@ceep.com",
      senha_hash: hash,
      role: "super_admin",
      criado_em: new Date().toISOString(),
    }).write();
    console.log("✅ Super Admin criado: admin@ceep.com / admin123");
  }

  console.log("✅ Banco de dados inicializado!");
}

module.exports = { getDB, initDB };