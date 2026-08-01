import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, LogIn, LogOut, User, Settings, Bell, Check, Trash2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, getToken } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

const navItems = [
  { label: "Início",     path: "/" },
  { label: "TCCs",       path: "/tccs" },
  { label: "Categorias", path: "/categorias" },
  { label: "Sobre",      path: "/sobre" },
];

const roleBadge = (role?: string) => {
  if (role === "super_admin") return { label: "Super Admin", style: { background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" } };
  if (role === "admin")       return { label: "Admin",       style: { background: "rgba(29,78,216,0.12)", color: "#1d4ed8", border: "1px solid rgba(29,78,216,0.3)" } };
  return                             { label: "Usuário",     style: { background: "rgba(128,128,128,0.12)", color: "rgba(128,128,128,0.7)", border: "1px solid rgba(128,128,128,0.2)" } };
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [sininhoOpen, setSininhoOpen] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin, isSuperAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const sininhoRef = useRef<HTMLDivElement>(null);

  // ── theme tokens ──────────────────────────────────────────────────────────
  const navBg      = isDark ? "rgba(11,18,32,0.9)"         : "rgba(255,255,255,0.92)";
  const navBorder  = isDark ? "rgba(255,255,255,0.08)"     : "rgba(15,23,42,0.08)";
  const textMuted  = isDark ? "rgba(255,255,255,0.45)"     : "rgba(15,23,42,0.68)";
  const textActive = isDark ? "#ffffff"                    : "#0f172a";
  const mobileBg   = isDark ? "#0b1220"                    : "#f8fafc";
  const dropBg     = isDark ? "#0b1220"                    : "#ffffff";
  const dropBorder = isDark ? "rgba(255,255,255,0.1)"      : "rgba(15,23,42,0.1)";

  const carregarSolicitacoes = async () => {
    if (!isSuperAdmin) return;
    try {
      const res = await fetch(`${API}/auth/solicitacoes`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setSolicitacoes(await res.json());
    } catch {}
  };

  useEffect(() => {
    carregarSolicitacoes();
    if (isSuperAdmin) {
      const interval = setInterval(carregarSolicitacoes, 15000);
      return () => clearInterval(interval);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sininhoRef.current && !sininhoRef.current.contains(e.target as Node))
        setSininhoOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const aprovar = async (id: string) => {
    await fetch(`${API}/auth/solicitacoes/${id}/aprovar`, {
      method: "POST", headers: { Authorization: `Bearer ${getToken()}` },
    });
    carregarSolicitacoes();
  };

  const rejeitar = async (id: string) => {
    await fetch(`${API}/auth/solicitacoes/${id}/rejeitar`, {
      method: "POST", headers: { Authorization: `Bearer ${getToken()}` },
    });
    carregarSolicitacoes();
  };

  const handleLogout = () => { logout(); navigate("/"); };
  const badge = roleBadge(user?.role);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: navBg,
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: `1px solid ${navBorder}`,
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div className="flex h-16 items-center justify-between px-6">

{/* Logo Mobile */}
<Link to="/" className="flex md:hidden items-center shrink-0">
  <img
    src="/logo.png"
    alt="Logo CEEP"
    className="h-11 w-11 object-contain"
  />
</Link>

        {/* Título da página atual — desktop */}
        <div className="hidden md:block">
          <span className="text-sm font-semibold" style={{ color: textActive }}>
            {navItems.find(n => n.path === location.pathname)?.label ?? "TCC Digital"}
          </span>
        </div>

        {/* Nav desktop — middle */}
        <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 text-[13px] transition-colors"
                style={{
                  color: active ? textActive : textMuted,
                  fontWeight: active ? 500 : 400,
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-4 right-4 h-[2px] rounded-none"
                    style={{ background: "#1d4ed8" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right actions — desktop */}
        <div className="hidden md:flex items-center gap-2">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Modo claro" : "Modo escuro"}
            className="flex items-center justify-center rounded-lg transition-all"
            style={{
              width: 36, height: 36,
              color: textMuted,
              background: "transparent",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {isDark ? <Sun style={{ height: 17, width: 17 }} /> : <Moon style={{ height: 17, width: 17 }} />}
          </button>

          {isLoggedIn ? (
            <>
              <Link
                to="/perfil"
                className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg transition-all"
                style={{ color: textMuted }}
                onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <User className="h-4 w-4" style={{ color: "#1d4ed8" }} />
                <span className="font-medium text-[13px]" style={{ color: textActive }}>{user?.nome}</span>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-sm" style={badge.style}>
                  {badge.label}
                </span>
              </Link>

              {/* Bell */}
              {isSuperAdmin && (
                <div className="relative" ref={sininhoRef}>
                  <button
                    onClick={() => setSininhoOpen(!sininhoOpen)}
                    className="relative flex items-center justify-center rounded-lg transition-all"
                    style={{ width: 36, height: 36, color: textMuted, background: "transparent" }}
                    onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)"; e.currentTarget.style.color = textActive; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = textMuted; }}
                  >
                    <Bell className="h-5 w-5" />
                    {solicitacoes.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {sininhoOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 rounded-xl overflow-hidden z-50"
                        style={{ background: dropBg, border: `1px solid ${dropBorder}`, boxShadow: "0 20px 60px rgba(15,23,42,0.15)" }}
                      >
                        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${dropBorder}` }}>
                          <p className="text-sm font-semibold" style={{ color: textActive }}>Solicitações de Acesso</p>
                          <p className="text-xs" style={{ color: textMuted }}>
                            {solicitacoes.length} pendente{solicitacoes.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {solicitacoes.length === 0 ? (
                            <p className="text-sm text-center py-6" style={{ color: textMuted }}>
                              Nenhuma solicitação pendente.
                            </p>
                          ) : solicitacoes.map((s) => (
                            <div key={s._id} className="px-4 py-3" style={{ borderBottom: `1px solid ${dropBorder}` }}>
                              <p className="text-sm font-medium" style={{ color: textActive }}>{s.nome}</p>
                              <p className="text-xs" style={{ color: textMuted }}>{s.email}</p>
                              <p className="text-xs mb-3" style={{ color: textMuted }}>
                                {new Date(s.createdAt || s.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                              </p>
                              <div className="flex gap-2">
                                <button onClick={() => aprovar(s._id)}
                                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors"
                                  style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}
                                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(34,197,94,0.18)")}
                                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(34,197,94,0.1)")}
                                >
                                  <Check className="h-3 w-3" /> Aprovar
                                </button>
                                <button onClick={() => rejeitar(s._id)}
                                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors"
                                  style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                                >
                                  <Trash2 className="h-3 w-3" /> Rejeitar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-xs transition-colors" style={{ color: textMuted }}>
                    <Settings className="h-4 w-4 mr-1" /> Admin
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="sm" className="text-xs" style={{ color: textMuted }} onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <button
                className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded transition-opacity btn-blue-shine"
                style={{ background: "#1d4ed8", letterSpacing: "0.06em" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <LogIn className="h-4 w-4" /> Enviar TCC
              </button>
            </Link>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg"
            style={{ color: textMuted }}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isSuperAdmin && (
            <div className="relative" ref={sininhoRef}>
              <button
                onClick={() => setSininhoOpen(!sininhoOpen)}
                className="relative p-2 rounded-lg"
                style={{ color: textMuted }}
              >
                <Bell className="h-5 w-5" />
                {solicitacoes.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>
              <AnimatePresence>
                {sininhoOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 rounded-xl overflow-hidden z-50"
                    style={{ background: dropBg, border: `1px solid ${dropBorder}`, boxShadow: "0 20px 60px rgba(15,23,42,0.2)" }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: `1px solid ${dropBorder}` }}>
                      <p className="text-sm font-semibold" style={{ color: textActive }}>Solicitações</p>
                      <p className="text-xs" style={{ color: textMuted }}>
                        {solicitacoes.length} pendente{solicitacoes.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {solicitacoes.length === 0 ? (
                        <p className="text-sm text-center py-6" style={{ color: textMuted }}>Nenhuma pendente.</p>
                      ) : solicitacoes.map((s) => (
                        <div key={s._id} className="px-4 py-3" style={{ borderBottom: `1px solid ${dropBorder}` }}>
                          <p className="text-sm font-medium" style={{ color: textActive }}>{s.nome}</p>
                          <p className="text-xs mb-2" style={{ color: textMuted }}>{s.email}</p>
                          <div className="flex gap-2">
                            <button onClick={() => aprovar(s._id)} className="flex-1 py-1.5 rounded text-xs font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>✓ Aprovar</button>
                            <button onClick={() => rejeitar(s._id)} className="flex-1 py-1.5 rounded text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>✕ Rejeitar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: textMuted }}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{ background: mobileBg, borderTop: `1px solid ${navBorder}` }}
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3.5 rounded-lg text-sm font-medium transition-all"
                  style={location.pathname === item.path
                    ? { background: "rgba(29,78,216,0.1)", color: textActive, borderLeft: "2px solid #1d4ed8" }
                    : { color: textMuted }
                  }
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: `1px solid ${navBorder}` }}>
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/perfil"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all"
                    >
                      <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: "rgba(29,78,216,0.12)" }}>
                        <User className="h-4 w-4" style={{ color: "#1d4ed8" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-none" style={{ color: textActive }}>{user?.nome}</p>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-sm mt-0.5 inline-block" style={badge.style}>
                          {badge.label}
                        </span>
                      </div>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                        style={{ color: textMuted, border: `1px solid ${navBorder}` }}
                      >
                        <Settings className="h-4 w-4" /> Painel Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                      style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      <LogOut className="h-4 w-4" /> Sair
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold text-white"
                    style={{ background: "#1d4ed8", letterSpacing: "0.06em" }}
                  >
                    <LogIn className="h-4 w-4" /> Entrar na conta
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;