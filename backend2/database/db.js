const mongoose = require("mongoose");

async function initDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB conectado!");
    await criarSuperAdmin();
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
}

async function criarSuperAdmin() {
  const { Usuario } = require("./models");
  const bcrypt = require("bcryptjs");
  const adminExiste = await Usuario.findOne({ email: "admin@ceep.com" });
  if (!adminExiste) {
    const senha_hash = bcrypt.hashSync("admin123", 10);
    await Usuario.create({
      nome: "Administrador Lucas",
      email: "admin@ceep.com",
      senha_hash,
      role: "super_admin",
    });
    console.log("✅ Super Admin criado: admin@ceep.com / admin123");
  }
}

module.exports = { initDB };