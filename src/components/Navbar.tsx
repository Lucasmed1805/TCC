import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, LogIn, LogOut, User, Settings, Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, getToken } from "@/hooks/AuthContext";

const API = "http://localhost:3001/api";

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
      if (res.ok) {
        const data = await res.json();
        setSolicitacoes(data);
      }
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
      if (sininhoRef.current && !sininhoRef.current.contains(e.target as Node)) {
        setSininhoOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const aprovar = async (id: string) => {
    await fetch(`${API}/auth/solicitacoes/${id}/aprovar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    carregarSolicitacoes();
  };

  const rejeitar = async (id: string) => {
    await fetch(`${API}/auth/solicitacoes/${id}/rejeitar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    carregarSolicitacoes();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const badge = roleBadge(user?.role);

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-wide text-foreground font-serif">TCC Digital</span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-accent uppercase">CEEP</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                location.pathname === item.path ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Nome + badge de tipo */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 text-accent" />
                <span className="font-medium text-foreground">{user?.nome}</span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={badge.style}
                >
                  {badge.label}
                </span>
              </div>

              {isSuperAdmin && (
                <div className="relative" ref={sininhoRef}>
                  <button
                    onClick={() => setSininhoOpen(!sininhoOpen)}
                    className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {solicitacoes.length > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {sininhoOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 rounded-xl border border-border/40 bg-card shadow-xl z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-border/30">
                          <p className="text-sm font-semibold text-foreground">Solicitações de Acesso</p>
                          <p className="text-xs text-muted-foreground">
                            {solicitacoes.length} pendente{solicitacoes.length !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {solicitacoes.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                              Nenhuma solicitação pendente.
                            </p>
                          ) : (
                            solicitacoes.map((s) => (
                              <div key={s.id} className="px-4 py-3 border-b border-border/20 last:border-0">
                                <p className="text-sm font-medium text-foreground">{s.nome}</p>
                                <p className="text-xs text-muted-foreground">{s.email}</p>
                                <p className="text-xs text-muted-foreground mb-3">
                                  {new Date(s.criado_em).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => aprovar(s.id)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs font-medium transition-colors"
                                  >
                                    <Check className="h-3 w-3" /> Aprovar
                                  </button>
                                  <button
                                    onClick={() => rejeitar(s.id)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-medium transition-colors"
                                  >
                                    <Trash2 className="h-3 w-3" /> Rejeitar
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Settings className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <LogIn className="h-4 w-4 mr-1" />
                Entrar
              </Button>
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/20 bg-background overflow-hidden"
          >
            <nav className="container flex flex-col gap-1 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium ${
                    location.pathname === item.path ? "bg-accent/10 text-accent" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-2 px-4">
                {isLoggedIn ? (
                  <>
                    {/* Badge mobile */}
                    <div className="flex items-center gap-2 py-1">
                      <User className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">{user?.nome}</span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={badge.style}
                      >
                        {badge.label}
                      </span>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setOpen(false)}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Settings className="h-4 w-4 mr-1" />
                          Painel Admin
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-1" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Entrar</Button>
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