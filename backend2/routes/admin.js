const express = require("express");
const { getDB } = require("../database/db");
const { adminMiddleware, superAdminMiddleware } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", adminMiddleware, (req, res) => {
  const db = getDB();
  const tccs = db.get("tccs").value();
  const usuarios = db.get("usuarios").value();

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

router.get("/usuarios", adminMiddleware, (req, res) => {
  const db = getDB();
  const usuarios = db.get("usuarios").value().map(({ senha_hash, ...u }) => u);
  res.json(usuarios);
});

router.put("/usuarios/:id/role", superAdminMiddleware, (req, res) => {
  const { role } = req.body;
  if (!["admin", "user"].includes(role))
    return res.status(400).json({ error: "Role inválido." });

  const db = getDB();
  const alvo = db.get("usuarios").find({ id: req.params.id }).value();

  if (!alvo) return res.status(404).json({ error: "Usuário não encontrado." });
  if (alvo.role === "super_admin")
    return res.status(403).json({ error: "Não é possível alterar o Super Admin." });

  db.get("usuarios").find({ id: req.params.id }).assign({ role }).write();
  res.json({ message: "Role atualizado." });
});

router.put("/usuarios/:id/nome", adminMiddleware, (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome obrigatório." });

  const db = getDB();
  db.get("usuarios").find({ id: req.params.id }).assign({ nome }).write();
  res.json({ message: "Nome atualizado." });
});

router.delete("/usuarios/:id", superAdminMiddleware, (req, res) => {
  const db = getDB();
  const alvo = db.get("usuarios").find({ id: req.params.id }).value();

  if (!alvo) return res.status(404).json({ error: "Usuário não encontrado." });
  if (alvo.role === "super_admin")
    return res.status(403).json({ error: "Não é possível remover o Super Admin." });
  if (req.params.id === req.user.id)
    return res.status(403).json({ error: "Você não pode se deletar." });

  db.get("usuarios").remove({ id: req.params.id }).write();
  res.json({ message: "Usuário removido." });
});

module.exports = router;