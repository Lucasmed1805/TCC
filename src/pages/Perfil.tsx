import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, getToken } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/ThemeContext";
import { User, BookOpen, GraduationCap, Pencil, LogOut, ShieldCheck, Shield, ChevronDown, Check, ArrowLeft } from "lucide-react";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}`;

const cursos = ["Informática", "Redes de Computadores"];
const turmas = ["1º Ano", "2º Ano", "3º Ano", "Concluinte", "Outro"];

const Field = ({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode; isDark: boolean }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "rgba(128,128,128,0.7)" }}>
      {icon}{label}
    </label>
    {children}
  </div>
);

const StyledInput = ({ isDark, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { isDark: boolean }) => {
  const base = {
    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.12)",
    color: isDark ? "#fff" : "#0d1b2a",
  };
  const focus = {
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
    border: "1px solid rgba(96,165,250,0.4)",
    color: isDark ? "#fff" : "#0d1b2a",
  };
  return (
    <input
      {...props}
      className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
      style={base}
      onFocus={(e) => Object.assign(e.target.style, focus)}
      onBlur={(e) => Object.assign(e.target.style, base)}
    />
  );
};

const CustomSelect = ({
  value, onChange, options, placeholder, isDark,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  isDark: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const base = {
    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.12)",
  };
  const focusStyle = {
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
    border: "1px solid rgba(96,165,250,0.4)",
  };
  const dropBg  = isDark ? "#0f1f3d" : "#ffffff";
  const textCol = isDark ? "#ffffff" : "#0d1b2a";
  const mutedCol = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-xl px-4 py-3 text-sm text-left flex items-center justify-between transition-all"
        style={open ? focusStyle : base}
      >
        <span style={{ color: value ? textCol : mutedCol }}>{value || placeholder}</span>
        <ChevronDown style={{ height: 15, width: 15, color: mutedCol, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>

      {open && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{ background: dropBg, border: "1px solid rgba(96,165,250,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
        >
          <button
            type="button"
            onClick={() => { onChange(""); setOpen(false); }}
            className="w-full px-4 py-3 text-sm text-left transition-all"
            style={{ color: mutedCol, background: "transparent" }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full px-4 py-3 text-sm text-left transition-all flex items-center justify-between"
              style={{
                color: value === opt ? "#60a5fa" : textCol,
                background: value === opt ? "rgba(96,165,250,0.1)" : "transparent",
                borderTop: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.05)",
              }}
              onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = value === opt ? "rgba(96,165,250,0.1)" : "transparent"; }}
            >
              {opt}
              {value === opt && <Check style={{ height: 13, width: 13, color: "#60a5fa", flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Perfil = () => {
  const { user, logout, isLoggedIn, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDark } = useTheme();

  const { id: perfilId } = useParams<{ id?: string }>();
  const modoVisualizacao = !!perfilId && perfilId !== user?.id;

  const [perfilExterno, setPerfilExterno] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  const [nome, setNome] = useState(user?.nome || "");
  const [turma, setTurma] = useState((user as any)?.turma || "");
  const [curso, setCurso] = useState((user as any)?.curso || "");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (modoVisualizacao && (isAdmin || isSuperAdmin)) {
      setCarregando(true);
      fetch(`${API}/api/admin/usuarios/${perfilId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
        .then(r => r.json())
        .then(data => setPerfilExterno(data))
        .catch(() => { toast({ title: "Erro ao carregar perfil.", variant: "destructive" }); navigate("/admin"); })
        .finally(() => setCarregando(false));
    }
  }, [perfilId]);

  if (!isLoggedIn) { navigate("/login"); return null; }
  if (modoVisualizacao && !isAdmin && !isSuperAdmin) { navigate("/"); return null; }

  const dadosExibidos = modoVisualizacao ? perfilExterno : user;

  const roleBadge = (role?: string) => {
    const r = role || dadosExibidos?.role;
    if (r === "super_admin") return { label: "Super Admin",    color: "#f5a623", bg: "rgba(245,166,35,0.15)",  border: "rgba(245,166,35,0.3)",  Icon: ShieldCheck };
    if (r === "admin")       return { label: "Administrador",  color: "#fb923c", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)",  Icon: Shield };
    return                          { label: "Usuário",        color: "#60a5fa", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)",  Icon: User };
  };

  const badge   = roleBadge();
  const RoleIcon = badge.Icon;
  const inicial = dadosExibidos?.nome?.charAt(0).toUpperCase() || "?";

  const dataFormatada = dadosExibidos?.createdAt
    ? new Date(dadosExibidos.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
    : "—";

  // ── theme tokens ──
  const pageBg   = isDark ? "#060e1f"  : "#f0f4f8";
  const headerBg = isDark ? "linear-gradient(160deg,#0a1628,#0d2550 60%,#060e1f)" : "linear-gradient(160deg,#dce8f5,#c8dcf0 60%,#f0f4f8)";
  const cardBg   = isDark ? "#111f38"  : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textMain = isDark ? "#ffffff"  : "#0d1b2a";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";
  const textSub  = isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)";
  const rowBorder = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
  const accentText = isDark ? "#60a5fa" : "#2563eb";

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(`${API}/api/auth/perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ nome, turma, curso }),
      });
      if (res.ok) {
        const stored = localStorage.getItem("tcc_user");
        if (stored) localStorage.setItem("tcc_user", JSON.stringify({ ...JSON.parse(stored), nome, turma, curso }));
        toast({ title: "✅ Perfil atualizado com sucesso!" });
      } else {
        const data = await res.json();
        toast({ title: "Erro ao atualizar", description: data.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Erro de conexão", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
    }
    setSalvando(false);
  };

  const handleLogout = () => { logout(); navigate("/"); };

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: pageBg }}>
        <div className="h-8 w-8 rounded-full border-2 animate-spin" style={{ borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)", borderTopColor: isDark ? "#fff" : "#0d1b2a" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors" style={{ background: pageBg }}>

      {/* Header */}
      <div className="px-5 pt-8 pb-6" style={{ background: headerBg }}>
        <div className="max-w-lg mx-auto">
          {modoVisualizacao && (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 mb-4 text-xs font-semibold transition-all"
              style={{ color: textMuted }}
            >
              <ArrowLeft style={{ height: 14, width: 14 }} />
              Voltar para o painel
            </button>
          )}

          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: accentText }}>
            {modoVisualizacao ? "Visualizando Perfil" : "Minha Conta"}
          </p>

          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shrink-0 relative"
              style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}
            >
              {inicial}
              <div
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center"
                style={{ background: pageBg, border: `2px solid ${cardBg}` }}
              >
                <RoleIcon style={{ height: 12, width: 12, color: badge.color }} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold" style={{ color: textMain }}>{dadosExibidos?.nome}</h1>
              <p className="text-sm mt-0.5" style={{ color: textMuted }}>{dadosExibidos?.email}</p>
              <span
                className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
              >
                {badge.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 pb-10 max-w-lg mx-auto space-y-4">

        {modoVisualizacao ? (
          <div className="rounded-2xl p-5 space-y-3" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: textMuted }}>Informações do Usuário</p>

            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
              style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)" }}
            >
              <ShieldCheck style={{ height: 12, width: 12, color: "#f5a623", flexShrink: 0 }} />
              <p className="text-[10px] font-semibold" style={{ color: "#f5a623" }}>
                Você está visualizando este perfil como administrador — somente leitura
              </p>
            </div>

            {[
              { label: "Nome",            value: dadosExibidos?.nome || "—" },
              { label: "E-mail",          value: dadosExibidos?.email || "—" },
              { label: "Nível de acesso", value: badge.label },
              { label: "Curso",           value: dadosExibidos?.curso || "—" },
              { label: "Turma",           value: dadosExibidos?.turma || "—" },
              { label: "Cadastrado em",   value: dataFormatada },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${rowBorder}` }}>
                <span className="text-xs" style={{ color: textMuted }}>{label}</span>
                <span className="text-xs font-medium" style={{ color: textSub }}>{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-2xl p-5 space-y-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex items-center gap-2 mb-1">
                <Pencil style={{ height: 15, width: 15, color: accentText }} />
                <p className="text-sm font-semibold" style={{ color: textMain }}>Editar Perfil</p>
              </div>

              <form onSubmit={salvar} className="space-y-4">
                <Field label="Nome de exibição" icon={<User style={{ height: 11, width: 11 }} />} isDark={isDark}>
                  <StyledInput isDark={isDark} value={nome} onChange={e => setNome(e.target.value)} required placeholder="Seu nome completo" />
                </Field>

                <Field label="Curso" icon={<BookOpen style={{ height: 11, width: 11 }} />} isDark={isDark}>
                  <CustomSelect isDark={isDark} value={curso} onChange={setCurso} options={cursos} placeholder="Selecione seu curso" />
                </Field>

                <Field label="Turma" icon={<GraduationCap style={{ height: 11, width: 11 }} />} isDark={isDark}>
                  <CustomSelect isDark={isDark} value={turma} onChange={setTurma} options={turmas} placeholder="Selecione sua turma" />
                </Field>

                <button
                  type="submit"
                  disabled={salvando}
                  className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)", boxShadow: "0 4px 20px rgba(37,99,235,0.25)" }}
                >
                  {salvando ? (
                    <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Salvando...</>
                  ) : (
                    <><Pencil style={{ height: 15, width: 15 }} /> Salvar Alterações</>
                  )}
                </button>
              </form>
            </div>

            <div className="rounded-2xl p-5 space-y-3" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>Informações da Conta</p>
              {[
                { label: "E-mail",          value: user?.email },
                { label: "Nível de acesso", value: badge.label },
                { label: "Curso",           value: (user as any)?.curso || curso || "—" },
                { label: "Turma",           value: (user as any)?.turma || turma || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${rowBorder}` }}>
                  <span className="text-xs" style={{ color: textMuted }}>{label}</span>
                  <span className="text-xs font-medium" style={{ color: textSub }}>{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <LogOut style={{ height: 15, width: 15 }} />
              Sair da Conta
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Perfil;