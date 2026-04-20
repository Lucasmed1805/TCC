const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const tccRoutes = require("./routes/tccs");
const adminRoutes = require("./routes/admin");
const { initDB } = require("./database/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/tccs", tccRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.json({ message: "TCC Digital API rodando!" }));

initDB().then(() => {
  app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
});
