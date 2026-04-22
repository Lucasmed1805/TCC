const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha_hash: String,
  role: { type: String, default: "user" },
  turma: { type: String, default: "" },
  curso: { type: String, default: "" },
}, { timestamps: true });

const tccSchema = new mongoose.Schema({
  titulo: String,
  autor: String,
  curso: String,
  ano: Number,
  resumo: String,
  tipo: { type: String, default: "tcc" },
  arquivo_url: String,
  usuario_id: String,
  downloads: { type: Number, default: 0 },
  visualizacoes: { type: Number, default: 0 },
}, { timestamps: true });

const solicitacaoSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha_hash: String,
}, { timestamps: true });

const Usuario = mongoose.model("Usuario", usuarioSchema);
const Tcc = mongoose.model("Tcc", tccSchema);
const Solicitacao = mongoose.model("Solicitacao", solicitacaoSchema);

module.exports = { Usuario, Tcc, Solicitacao };