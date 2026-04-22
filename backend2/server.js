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

initDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
});