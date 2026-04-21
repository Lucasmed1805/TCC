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
  if (role === "super_admin") return { label: "Super Admin", style: { background: "#f3e8ff", color: "#7c3aed", border: "1px solid #ddd6fe" } };
  if (role === "admin")       return { label: "Admin",       style: { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" } };
  return                             { label: "Usuário",     style: { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" } };
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a1628]/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "linear-gradient(135deg, #1a4fa0, #2563eb)" }}>
            <BookOpen className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-white tracking-wide">TCC Digital</span>
            <span className="text-[9px] font-semibold tracking-[0.25em] uppercase" style={{ color: "#f5a623" }}>CEEP</span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === item.path ? "text-white" : "text-white/50 hover:text-white/80"
              }`}>
              {item.label}
              {location.pathname === item.path && (
                <motion.div layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ background: "#f5a623" }} />
              )}
            </Link>
          ))}
        </nav>

        {/* Ações desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" style={{ color: "#f5a623" }} />
                <span className="font-medium text-white">{user?.nome}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={badge.style}>
                  {badge.label}
                </span>
              </div>

              {isSuperAdmin && (
                <div className="relative" ref={sininhoRef}>
                  <button onClick={() => setSininhoOpen(!sininhoOpen)}
                    className="relative p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                    <Bell className="h-5 w-5" />
                    {solicitacoes.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0a1628]" />
                    )}
                  </button>
                  <AnimatePresence>
                    {sininhoOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                        style={{ background: "#0f1f3d" }}>
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-semibold text-white">Solicitações de Acesso</p>
                          <p className="text-xs text-white/40">{solicitacoes.length} pendente{solicitacoes.length !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {solicitacoes.length === 0 ? (
                            <p className="text-sm text-white/40 text-center py-6">Nenhuma solicitação pendente.</p>
                          ) : solicitacoes.map((s) => (
                            <div key={s._id} className="px-4 py-3 border-b border-white/5 last:border-0">
                              <p className="text-sm font-medium text-white">{s.nome}</p>
                              <p className="text-xs text-white/40">{s.email}</p>
                              <p className="text-xs text-white/30 mb-3">
                                {new Date(s.createdAt || s.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                              </p>
                              <div className="flex gap-2">
                                <button onClick={() => aprovar(s._id)}
                                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-medium transition-colors">
                                  <Check className="h-3 w-3" /> Aprovar
                                </button>
                                <button onClick={() => rejeitar(s._id)}
                                  className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-medium transition-colors">
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
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                    <Settings className="h-4 w-4 mr-1" /> Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="text-white font-semibold"
                style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}>
                <LogIn className="h-4 w-4 mr-1" /> Entrar
              </Button>
            </Link>
          )}
        </div>

        {/* Botões mobile direita */}
        <div className="flex md:hidden items-center gap-2">
          {isSuperAdmin && (
            <div className="relative" ref={sininhoRef}>
              <button onClick={() => setSininhoOpen(!sininhoOpen)}
                className="relative p-2 rounded-lg text-white/60 hover:text-white">
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
                    className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                    style={{ background: "#0f1f3d" }}>
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">Solicitações</p>
                      <p className="text-xs text-white/40">{solicitacoes.length} pendente{solicitacoes.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {solicitacoes.length === 0 ? (
                        <p className="text-sm text-white/40 text-center py-6">Nenhuma pendente.</p>
                      ) : solicitacoes.map((s) => (
                        <div key={s._id} className="px-4 py-3 border-b border-white/5 last:border-0">
                          <p className="text-sm font-medium text-white">{s.nome}</p>
                          <p className="text-xs text-white/40 mb-2">{s.email}</p>
                          <p className="text-xs text-white/30 mb-2">
                            {new Date(s.createdAt || s.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                          <div className="flex gap-2">
                            <button onClick={() => aprovar(s._id)}
                              className="flex-1 py-1.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
                              ✓ Aprovar
                            </button>
                            <button onClick={() => rejeitar(s._id)}
                              className="flex-1 py-1.5 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">
                              ✕ Rejeitar
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
          <button onClick={() => setOpen(!open)}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
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
            className="md:hidden overflow-hidden border-t border-white/10"
            style={{ background: "#0d1e3a" }}>
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                  className={`flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === item.path ? "text-white font-semibold" : "text-white/50"
                  }`}
                  style={location.pathname === item.path
                    ? { background: "rgba(26,79,160,0.35)", borderLeft: "3px solid #f5a623" }
                    : {}}>
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-2 px-2 py-1">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(245,166,35,0.15)" }}>
                        <User className="h-4 w-4" style={{ color: "#f5a623" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-none">{user?.nome}</p>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block" style={badge.style}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white border border-white/10">
                        <Settings className="h-4 w-4" /> Painel Admin
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors">
                      <LogOut className="h-4 w-4" /> Sair
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-colors"
                    style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}>
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