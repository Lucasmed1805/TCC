const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const tccRoutes = require("./routes/tccs");
const adminRoutes = require("./routes/admin");
const iaRoutes = require("./routes/ia");
const { initDB } = require("./database/db");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:8080",
    "https://tcc-ten-beta.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/tccs", tccRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ia", iaRoutes);

app.get("/", (req, res) => res.json({ message: "TCC Digital API rodando!" }));

// ── Keep-alive: evita hibernação do Render (plano gratuito) ──
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || null;

function iniciarKeepAlive() {
  if (!RENDER_URL) {
    console.log("⚠️  RENDER_EXTERNAL_URL não definida — keep-alive desativado.");
    return;
  }
  // Faz um ping a cada 10 minutos
  setInterval(async () => {
    try {
      await fetch(`${RENDER_URL}/`);
      console.log(`🏓 Keep-alive ping OK (${new Date().toISOString()})`);
    } catch (err) {
      console.warn("⚠️  Keep-alive ping falhou:", err.message);
    }
  }, 10 * 60 * 1000); // 10 minutos
}

initDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
    iniciarKeepAlive();
  });
}).catch(err => {
  console.error("Erro ao iniciar:", err);
  process.exit(1);
});

module.exports = app;