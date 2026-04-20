const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../database/db");
const { JWT_SECRET, authMiddleware, superAdminMiddleware } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/cadastro (usuário comum - acesso direto)
router.post("/cadastro", (req, res) => {
  const { nome, email, password } = req.body;

  if (!nome || !email || !password)
    return res.status(400).json({ error: "Preencha todos os campos." });

  if (password.length < 6)
    return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres." });

  const db = getDB();
  const emailLower = email.toLowerCase();

  const usuarioExiste = db.get("usuarios").find({ email: emailLower }).value();
  if (usuarioExiste) return res.status(409).json({ error: "E-mail já cadastrado." });

  const id = uuidv4();
  const senha_hash = bcrypt.hashSync(password, 10);

  db.get("usuarios").push({
    id,
    nome,
    email: emailLower,
    senha_hash,
    role: "user",
    criado_em: new Date().toISOString(),
  }).write();

  const token = jwt.sign(
    { id, nome, email: emailLower, role: "user" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    token,
    user: { id, nome, email: emailLower, role: "user" },
  });
});

// POST /api/auth/solicitar
router.post("/solicitar", (req, res) => {
  const { nome, email, password } = req.body;

  if (!nome || !email || !password)
    return res.status(400).json({ error: "Preencha todos os campos." });

  if (password.length < 6)
    return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres." });

  const db = getDB();
  const emailLower = email.toLowerCase();

  const usuarioExiste = db.get("usuarios").find({ email: emailLower }).value();
  if (usuarioExiste) return res.status(409).json({ error: "E-mail já cadastrado." });

  const solicitacaoExiste = db.get("solicitacoes").find({ email: emailLower }).value();
  if (solicitacaoExiste) return res.status(409).json({ error: "Já existe uma solicitação com este e-mail." });

  const id = uuidv4();
  const senha_hash = bcrypt.hashSync(password, 10);

  db.get("solicitacoes").push({
    id,
    nome,
    email: emailLower,
    senha_hash,
    criado_em: new Date().toISOString(),
  }).write();

  res.status(201).json({ message: "Solicitação enviada! Aguarde aprovação do administrador." });
});

// GET /api/auth/solicitacoes
router.get("/solicitacoes", superAdminMiddleware, (req, res) => {
  const db = getDB();
  const solicitacoes = db.get("solicitacoes").value().map(({ senha_hash, ...s }) => s);
  res.json(solicitacoes);
});

// POST /api/auth/solicitacoes/:id/aprovar
router.post("/solicitacoes/:id/aprovar", superAdminMiddleware, (req, res) => {
  const db = getDB();
  const solicitacao = db.get("solicitacoes").find({ id: req.params.id }).value();
  if (!solicitacao) return res.status(404).json({ error: "Solicitação não encontrada." });

  db.get("usuarios").push({
    id: uuidv4(),
    nome: solicitacao.nome,
    email: solicitacao.email,
    senha_hash: solicitacao.senha_hash,
    role: "admin",
    criado_em: new Date().toISOString(),
  }).write();

  db.get("solicitacoes").remove({ id: req.params.id }).write();
  res.json({ message: "Usuário aprovado como admin." });
});

// POST /api/auth/solicitacoes/:id/rejeitar
router.post("/solicitacoes/:id/rejeitar", superAdminMiddleware, (req, res) => {
  const db = getDB();
  const solicitacao = db.get("solicitacoes").find({ id: req.params.id }).value();
  if (!solicitacao) return res.status(404).json({ error: "Solicitação não encontrada." });

  db.get("solicitacoes").remove({ id: req.params.id }).write();
  res.json({ message: "Solicitação rejeitada." });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Preencha e-mail e senha." });

  const db = getDB();
  const user = db.get("usuarios").find({ email: email.toLowerCase() }).value();

  if (!user || !bcrypt.compareSync(password, user.senha_hash))
    return res.status(401).json({ error: "E-mail ou senha incorretos." });

  const token = jwt.sign(
    { id: user.id, nome: user.nome, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, role: user.role } });
});

// GET /api/auth/me
router.get("/me", authMiddleware, (req, res) => {
  const db = getDB();
  const user = db.get("usuarios").find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
  const { senha_hash, ...userSemSenha } = user;
  res.json(userSemSenha);
});

// PUT /api/auth/perfil
router.put("/perfil", authMiddleware, (req, res) => {
  const { nome, senhaAtual, novaSenha } = req.body;

  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

  const db = getDB();
  const user = db.get("usuarios").find({ id: req.user.id }).value();
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

  if (novaSenha) {
    if (!senhaAtual)
      return res.status(400).json({ error: "Informe a senha atual para trocar a senha." });
    if (!bcrypt.compareSync(senhaAtual, user.senha_hash))
      return res.status(401).json({ error: "Senha atual incorreta." });
    if (novaSenha.length < 6)
      return res.status(400).json({ error: "Nova senha deve ter pelo menos 6 caracteres." });

    const nova_hash = bcrypt.hashSync(novaSenha, 10);
    db.get("usuarios").find({ id: req.user.id }).assign({ nome, senha_hash: nova_hash }).write();
  } else {
    db.get("usuarios").find({ id: req.user.id }).assign({ nome }).write();
  }

  res.json({ message: "Perfil atualizado com sucesso." });
});

module.exports = router;