const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario, Solicitacao } = require("../database/models");
const { JWT_SECRET, authMiddleware, superAdminMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/cadastro", async (req, res) => {
  const { nome, email, password } = req.body;
  if (!nome || !email || !password)
    return res.status(400).json({ error: "Preencha todos os campos." });
  if (password.length < 6)
    return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres." });

  const emailLower = email.toLowerCase();
  const usuarioExiste = await Usuario.findOne({ email: emailLower });
  if (usuarioExiste) return res.status(409).json({ error: "E-mail já cadastrado." });

  const senha_hash = bcrypt.hashSync(password, 10);
  const user = await Usuario.create({ nome, email: emailLower, senha_hash, role: "user" });

  const token = jwt.sign({ id: user._id, nome, email: emailLower, role: "user" }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id: user._id, nome, email: emailLower, role: "user", turma: "", curso: "" } });
});

router.post("/solicitar", async (req, res) => {
  const { nome, email, password } = req.body;
  if (!nome || !email || !password)
    return res.status(400).json({ error: "Preencha todos os campos." });
  if (password.length < 6)
    return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres." });

  const emailLower = email.toLowerCase();
  const usuarioExiste = await Usuario.findOne({ email: emailLower });
  if (usuarioExiste) return res.status(409).json({ error: "E-mail já cadastrado." });

  const solicitacaoExiste = await Solicitacao.findOne({ email: emailLower });
  if (solicitacaoExiste) return res.status(409).json({ error: "Já existe uma solicitação com este e-mail." });

  const senha_hash = bcrypt.hashSync(password, 10);
  await Solicitacao.create({ nome, email: emailLower, senha_hash });
  res.status(201).json({ message: "Solicitação enviada! Aguarde aprovação do administrador." });
});

router.get("/solicitacoes", superAdminMiddleware, async (req, res) => {
  const solicitacoes = await Solicitacao.find().select("-senha_hash");
  res.json(solicitacoes);
});

router.post("/solicitacoes/:id/aprovar", superAdminMiddleware, async (req, res) => {
  const solicitacao = await Solicitacao.findById(req.params.id);
  if (!solicitacao) return res.status(404).json({ error: "Solicitação não encontrada." });

  await Usuario.create({
    nome: solicitacao.nome,
    email: solicitacao.email,
    senha_hash: solicitacao.senha_hash,
    role: "admin",
  });

  await Solicitacao.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuário aprovado como admin." });
});

router.post("/solicitacoes/:id/rejeitar", superAdminMiddleware, async (req, res) => {
  const solicitacao = await Solicitacao.findById(req.params.id);
  if (!solicitacao) return res.status(404).json({ error: "Solicitação não encontrada." });

  await Solicitacao.findByIdAndDelete(req.params.id);
  res.json({ message: "Solicitação rejeitada." });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Preencha e-mail e senha." });

  const user = await Usuario.findOne({ email: email.toLowerCase() });
  if (!user || !bcrypt.compareSync(password, user.senha_hash))
    return res.status(401).json({ error: "E-mail ou senha incorretos." });

  const token = jwt.sign(
    { id: user._id, nome: user.nome, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: {
      id: user._id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      turma: user.turma || "",
      curso: user.curso || "",
    },
  });
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await Usuario.findById(req.user.id).select("-senha_hash");
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
  res.json(user);
});

router.put("/perfil", authMiddleware, async (req, res) => {
  const { nome, turma, curso, senhaAtual, novaSenha } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório." });

  const user = await Usuario.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

  if (novaSenha) {
    if (!senhaAtual) return res.status(400).json({ error: "Informe a senha atual." });
    if (!bcrypt.compareSync(senhaAtual, user.senha_hash))
      return res.status(401).json({ error: "Senha atual incorreta." });
    if (novaSenha.length < 6) return res.status(400).json({ error: "Nova senha deve ter pelo menos 6 caracteres." });
    user.senha_hash = bcrypt.hashSync(novaSenha, 10);
  }

  user.nome = nome;
  if (turma !== undefined) user.turma = turma;
  if (curso !== undefined) user.curso = curso;

  await user.save();
  res.json({
    message: "Perfil atualizado com sucesso.",
    user: {
      id: user._id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      turma: user.turma,
      curso: user.curso,
    },
  });
});

module.exports = router;