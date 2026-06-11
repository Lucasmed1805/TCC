const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { Tcc } = require("../database/models");
const { adminMiddleware } = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const router = express.Router();

// ── Configuração do Cloudinary ──
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer em memória (não salva no disco) ──
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf")
      return cb(new Error("Apenas arquivos PDF são permitidos."));
    cb(null, true);
  },
});

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

// ── Faz upload do buffer para o Cloudinary ──
const uploadToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: `tccs/${uuidv4()}-${filename}`,
        format: "pdf",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

// ── Rotas ──

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

    let arquivo_url = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      arquivo_url = result.secure_url;
    }

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

    let arquivo_url = tcc.arquivo_url;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
      arquivo_url = result.secure_url;
    }

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