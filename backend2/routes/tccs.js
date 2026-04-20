const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../database/db");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf")
      return cb(new Error("Apenas arquivos PDF são permitidos."));
    cb(null, true);
  },
});

// GET /api/tccs
router.get("/", (req, res) => {
  const { curso, tipo, q } = req.query;
  const db = getDB();

  let tccs = db.get("tccs").value();

  if (curso) tccs = tccs.filter((t) => t.curso === curso);
  if (tipo) tccs = tccs.filter((t) => t.tipo === tipo);
  if (q) {
    const query = q.toLowerCase();
    tccs = tccs.filter(
      (t) =>
        t.titulo.toLowerCase().includes(query) ||
        t.autor.toLowerCase().includes(query) ||
        (t.resumo && t.resumo.toLowerCase().includes(query))
    );
  }

  tccs = tccs.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
  res.json(tccs);
});

// GET /api/tccs/:id
router.get("/:id", (req, res) => {
  const db = getDB();
  const tcc = db.get("tccs").find({ id: req.params.id }).value();
  if (!tcc) return res.status(404).json({ error: "TCC não encontrado." });

  db.get("tccs").find({ id: req.params.id }).assign({ visualizacoes: (tcc.visualizacoes || 0) + 1 }).write();

  res.json({ ...tcc, visualizacoes: (tcc.visualizacoes || 0) + 1 });
});

// POST /api/tccs (admin)
router.post("/", adminMiddleware, upload.single("arquivo"), (req, res) => {
  const { titulo, autor, curso, ano, resumo, tipo } = req.body;

  if (!titulo || !autor || !curso || !ano)
    return res.status(400).json({ error: "Preencha os campos obrigatórios." });

  const db = getDB();
  const id = uuidv4();
  const arquivo_url = req.file ? `/uploads/${req.file.filename}` : null;

  const novoTcc = {
    id, titulo, autor, curso,
    ano: parseInt(ano),
    resumo: resumo || "",
    tipo: tipo || "tcc",
    arquivo_url,
    usuario_id: req.user.id,
    downloads: 0,
    visualizacoes: 0,
    criado_em: new Date().toISOString(),
  };

  db.get("tccs").push(novoTcc).write();
  res.status(201).json(novoTcc);
});

// PUT /api/tccs/:id (admin)
router.put("/:id", adminMiddleware, upload.single("arquivo"), (req, res) => {
  const { titulo, autor, curso, ano, resumo, tipo } = req.body;
  const db = getDB();

  const tcc = db.get("tccs").find({ id: req.params.id }).value();
  if (!tcc) return res.status(404).json({ error: "TCC não encontrado." });

  const arquivo_url = req.file ? `/uploads/${req.file.filename}` : tcc.arquivo_url;

  db.get("tccs").find({ id: req.params.id }).assign({
    titulo: titulo || tcc.titulo,
    autor: autor || tcc.autor,
    curso: curso || tcc.curso,
    ano: parseInt(ano) || tcc.ano,
    resumo: resumo ?? tcc.resumo,
    tipo: tipo || tcc.tipo,
    arquivo_url,
  }).write();

  res.json(db.get("tccs").find({ id: req.params.id }).value());
});

// DELETE /api/tccs/:id (admin)
router.delete("/:id", adminMiddleware, (req, res) => {
  const db = getDB();
  const tcc = db.get("tccs").find({ id: req.params.id }).value();
  if (!tcc) return res.status(404).json({ error: "TCC não encontrado." });

  db.get("tccs").remove({ id: req.params.id }).write();
  res.json({ message: "TCC removido com sucesso." });
});

// POST /api/tccs/:id/download
router.post("/:id/download", (req, res) => {
  const db = getDB();
  const tcc = db.get("tccs").find({ id: req.params.id }).value();
  if (tcc) {
    db.get("tccs").find({ id: req.params.id }).assign({ downloads: (tcc.downloads || 0) + 1 }).write();
  }
  res.json({ ok: true });
});

module.exports = router;
