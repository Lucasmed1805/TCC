const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { Tcc } = require("../database/models");
const { adminMiddleware } = require("../middleware/auth");

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
  limits: { fileSize: 50 * 1024 * 1024 }, // ✅ aumentado para 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf")
      return cb(new Error("Apenas arquivos PDF são permitidos."));
    cb(null, true);
  },
});

// ✅ Wrapper que captura erros do multer e retorna JSON em vez de pendurar
const uploadMiddleware = (req, res, next) => {
  upload.single("arquivo")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE")
        return res.status(400).json({ error: "Arquivo muito grande! Máximo permitido: 50MB." });
      return res.status(400).json({ error: `Erro no upload: ${err.message}` });
    }
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
};

router.get("/", async (req, res) => {
  const { curso, tipo, q } = req.query;
  let query = {};

  if (curso) query.curso = curso;
  if (tipo) query.tipo = tipo;
  if (q) {
    query.$or = [
      { titulo: { $regex: q, $options: "i" } },
      { autor: { $regex: q, $options: "i" } },
      { resumo: { $regex: q, $options: "i" } },
    ];
  }

  const tccs = await Tcc.find(query).sort({ createdAt: -1 });
  res.json(tccs);
});

router.get("/:id", async (req, res) => {
  const tcc = await Tcc.findById(req.params.id);
  if (!tcc) return res.status(404).json({ error: "TCC não encontrado." });

  tcc.visualizacoes = (tcc.visualizacoes || 0) + 1;
  await tcc.save();
  res.json(tcc);
});

router.post("/", adminMiddleware, uploadMiddleware, async (req, res) => {
  try {
    const { titulo, autor, curso, ano, resumo, tipo } = req.body;
    if (!titulo || !autor || !curso || !ano)
      return res.status(400).json({ error: "Preencha os campos obrigatórios." });

    const arquivo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const tcc = await Tcc.create({
      titulo, autor, curso,
      ano: parseInt(ano),
      resumo: resumo || "",
      tipo: tipo || "tcc",
      arquivo_url,
      usuario_id: req.user.id,
    });

    res.status(201).json(tcc);
  } catch (err) {
    console.error("Erro ao criar TCC:", err);
    res.status(500).json({ error: "Erro interno ao salvar o TCC." });
  }
});

router.put("/:id", adminMiddleware, uploadMiddleware, async (req, res) => {
  try {
    const { titulo, autor, curso, ano, resumo, tipo } = req.body;
    const tcc = await Tcc.findById(req.params.id);
    if (!tcc) return res.status(404).json({ error: "TCC não encontrado." });

    const arquivo_url = req.file ? `/uploads/${req.file.filename}` : tcc.arquivo_url;

    Object.assign(tcc, {
      titulo: titulo || tcc.titulo,
      autor: autor || tcc.autor,
      curso: curso || tcc.curso,
      ano: parseInt(ano) || tcc.ano,
      resumo: resumo ?? tcc.resumo,
      tipo: tipo || tcc.tipo,
      arquivo_url,
    });

    await tcc.save();
    res.json(tcc);
  } catch (err) {
    console.error("Erro ao atualizar TCC:", err);
    res.status(500).json({ error: "Erro interno ao atualizar o TCC." });
  }
});

router.delete("/:id", adminMiddleware, async (req, res) => {
  const tcc = await Tcc.findById(req.params.id);
  if (!tcc) return res.status(404).json({ error: "TCC não encontrado." });

  await Tcc.findByIdAndDelete(req.params.id);
  res.json({ message: "TCC removido com sucesso." });
});

router.post("/:id/download", async (req, res) => {
  const tcc = await Tcc.findById(req.params.id);
  if (tcc) {
    tcc.downloads = (tcc.downloads || 0) + 1;
    await tcc.save();
  }
  res.json({ ok: true });
});

module.exports = router;