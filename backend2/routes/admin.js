const express = require("express");
const { Usuario, Tcc } = require("../database/models");
const { adminMiddleware, superAdminMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", adminMiddleware, async (req, res) => {
  const tccs = await Tcc.find();
  const usuarios = await Usuario.find();

  const totalDownloads = tccs.reduce((sum, t) => sum + (t.downloads || 0), 0);
  const totalVisualizacoes = tccs.reduce((sum, t) => sum + (t.visualizacoes || 0), 0);

  const porCurso = tccs.reduce((acc, t) => {
    acc[t.curso] = (acc[t.curso] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalTccs: tccs.length,
    totalUsuarios: usuarios.length,
    totalDownloads,
    totalVisualizacoes,
    porCurso: Object.entries(porCurso).map(([curso, count]) => ({ curso, count })),
  });
});

router.get("/usuarios", adminMiddleware, async (req, res) => {
  const usuarios = await Usuario.find().select("-senha_hash");
  res.json(usuarios);
});

// ── Buscar um usuário pelo ID (para visualização de perfil pelo admin) ──
router.get("/usuarios/:id", adminMiddleware, async (req, res) => {
  const usuario = await Usuario.findById(req.params.id).select("-senha_hash");
  if (!usuario) return res.status(404).json({ error: "Usuário não encontrado." });
  res.json(usuario);
});

router.put("/usuarios/:id/role", superAdminMiddleware, async (req, res) => {
  const { role } = req.body;
  if (!["admin", "user"].includes(role))
    return res.status(400).json({ error: "Role inválido." });

  const alvo = await Usuario.findById(req.params.id);
  if (!alvo) return res.status(404).json({ error: "Usuário não encontrado." });
  if (alvo.role === "super_admin")
    return res.status(403).json({ error: "Não é possível alterar o Super Admin." });

  alvo.role = role;
  await alvo.save();
  res.json({ message: "Role atualizado." });
});

router.put("/usuarios/:id/nome", adminMiddleware, async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome obrigatório." });

  await Usuario.findByIdAndUpdate(req.params.id, { nome });
  res.json({ message: "Nome atualizado." });
});

router.delete("/usuarios/:id", superAdminMiddleware, async (req, res) => {
  const alvo = await Usuario.findById(req.params.id);
  if (!alvo) return res.status(404).json({ error: "Usuário não encontrado." });
  if (alvo.role === "super_admin")
    return res.status(403).json({ error: "Não é possível remover o Super Admin." });
  if (req.params.id === req.user.id)
    return res.status(403).json({ error: "Você não pode se deletar." });

  await Usuario.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuário removido." });
});

module.exports = router;