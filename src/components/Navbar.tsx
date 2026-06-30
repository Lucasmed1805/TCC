import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, LogIn, LogOut, User, Settings, Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, getToken } from "@/hooks/AuthContext";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api`;

const navItems = [
  { label: "Início", path: "/" },
  { label: "TCCs", path: "/tccs" },
  { label: "Categorias", path: "/categorias" },
];

const roleBadge = (role?: string) => {
  if (role === "super_admin") return { label: "Super Admin", style: { background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" } };
  if (role === "admin")       return { label: "Admin",       style: { background: "rgba(184,134,11,0.12)", color: "#b8860b", border: "1px solid rgba(184,134,11,0.3)" } };
  return                             { label: "Usuário",     style: { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" } };
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [sininhoOpen, setSininhoOpen] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin, isSuperAdmin, logout } = useAuth();
  const sininhoRef = useRef<HTMLDivElement>(null);

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
        background: "rgba(8,17,30,0.88)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="container flex h-16 items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              background: "#fff",
              boxShadow: "0 0 0 1px rgba(184,134,11,0.35)",
            }}
          >
            <BookOpen className="h-4.5 w-4.5" style={{ height: 18, width: 18, color: "#08111e" }} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
              TCC Digital
            </span>
            <span className="text-[8px] font-bold tracking-[0.28em] uppercase" style={{ color: "#b8860b" }}>
              CEEP
            </span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative px-4 py-2 text-[13px] transition-colors"
              style={{
                color: location.pathname === item.path ? "#fff" : "rgba(255,255,255,0.4)",
                fontWeight: location.pathname === item.path ? 500 : 400,
                letterSpacing: "0.02em",
              }}
            >
              {item.label}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-4 right-4 h-[2px] rounded-none"
                  style={{ background: "#b8860b" }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Ações desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                to="/perfil"
                className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg transition-all"
                style={{ color: "rgba(255,255,255,0.65)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <User className="h-4 w-4" style={{ color: "#b8860b" }} />
                <span className="font-medium text-white text-[13px]">{user?.nome}</span>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-sm" style={badge.style}>
                  {badge.label}
                </span>
              </Link>

              {isSuperAdmin && (
                <div className="relative" ref={sininhoRef}>
                  <button
                    onClick={() => setSininhoOpen(!sininhoOpen)}
                    className="relative p-2 rounded-lg transition-colors"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                  >
                    <Bell className="h-5 w-5" />
                    {solicitacoes.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2" style={{ ringColor: "#08111e" }} />
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
                        style={{
                          background: "#0b1624",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                        }}
                      >
                        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          <p className="text-sm font-semibold text-white">Solicitações de Acesso</p>
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {solicitacoes.length} pendente{solicitacoes.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {solicitacoes.length === 0 ? (
                            <p className="text-sm text-center py-6" style={{ color: "rgba(255,255,255,0.3)" }}>
                              Nenhuma solicitação pendente.
                            </p>
                          ) : solicitacoes.map((s) => (
                            <div key={s._id} className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                              <p className="text-sm font-medium text-white">{s.nome}</p>
                              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{s.email}</p>
                              <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
                                {new Date(s.createdAt || s.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                              </p>
                              <div className="flex gap-2">
                                <button onClick={() => aprovar(s._id)}
                                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors"
                                  style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}
                                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(34,197,94,0.18)")}
                                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(34,197,94,0.1)")}
                                >
                                  <Check className="h-3 w-3" /> Aprovar
                                </button>
                                <button onClick={() => rejeitar(s._id)}
                                  className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors"
                                  style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
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
                  <Button
                    variant="ghost" size="sm"
                    className="text-xs transition-colors"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    <Settings className="h-4 w-4 mr-1" /> Admin
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost" size="sm"
                className="text-xs transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" /> Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <button
                className="flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded transition-opacity btn-gold-shine"
                style={{ background: "#b8860b", letterSpacing: "0.06em" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <LogIn className="h-4 w-4" /> Entrar
              </button>
            </Link>
          )}
        </div>

        {/* Mobile direita */}
        <div className="flex md:hidden items-center gap-2">
          {isSuperAdmin && (
            <div className="relative" ref={sininhoRef}>
              <button
                onClick={() => setSininhoOpen(!sininhoOpen)}
                className="relative p-2 rounded-lg"
                style={{ color: "rgba(255,255,255,0.5)" }}
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
                    style={{ background: "#0b1624", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-sm font-semibold text-white">Solicitações</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {solicitacoes.length} pendente{solicitacoes.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {solicitacoes.length === 0 ? (
                        <p className="text-sm text-center py-6" style={{ color: "rgba(255,255,255,0.3)" }}>Nenhuma pendente.</p>
                      ) : solicitacoes.map((s) => (
                        <div key={s._id} className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <p className="text-sm font-medium text-white">{s.nome}</p>
                          <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>{s.email}</p>
                          <div className="flex gap-2">
                            <button onClick={() => aprovar(s._id)} className="flex-1 py-1.5 rounded text-xs font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>✓ Aprovar</button>
                            <button onClick={() => rejeitar(s._id)} className="flex-1 py-1.5 rounded text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>✕ Rejeitar</button>
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
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
            style={{ background: "#0b1624", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3.5 rounded-lg text-sm font-medium transition-all"
                  style={location.pathname === item.path
                    ? { background: "rgba(184,134,11,0.1)", color: "#fff", borderLeft: "2px solid #b8860b" }
                    : { color: "rgba(255,255,255,0.4)" }
                  }
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/perfil"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg transition-all"
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: "rgba(184,134,11,0.12)" }}>
                        <User className="h-4 w-4" style={{ color: "#b8860b" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-none">{user?.nome}</p>
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
                        style={{ color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <Settings className="h-4 w-4" /> Painel Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                      style={{ color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      <LogOut className="h-4 w-4" /> Sair
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-lg text-sm font-bold text-white"
                    style={{ background: "#b8860b", letterSpacing: "0.06em" }}
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