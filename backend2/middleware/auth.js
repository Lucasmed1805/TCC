const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "tcc_digital_secret_2024";

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token não fornecido." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (!["admin", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Acesso restrito a administradores." });
    }
    next();
  });
}

function superAdminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ error: "Acesso restrito ao Super Administrador." });
    }
    next();
  });
}

module.exports = { authMiddleware, adminMiddleware, superAdminMiddleware, JWT_SECRET };