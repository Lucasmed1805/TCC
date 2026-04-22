import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getToken } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, BookOpen, GraduationCap, Pencil, LogOut, ShieldCheck, Shield } from "lucide-react";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}`;

const cursos = ["Informática", "Redes de Computadores"];
const turmas = ["1º Ano", "2º Ano", "3º Ano", "Concluinte", "Outro"];

const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" };
const inputFocusStyle = { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(96,165,250,0.4)" };

const Field = ({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
      {icon}{label}
    </label>
    {children}
  </div>
);

const StyledInput = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={inputClass}
    style={inputStyle}
    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
  />
);

const StyledSelect = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={inputClass}
    style={{ ...inputStyle, color: "white" }}
  >
    {children}
  </select>
);

const Perfil = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [nome, setNome] = useState(user?.nome || "");
  const [turma, setTurma] = useState((user as any)?.turma || "");
  const [curso, setCurso] = useState((user as any)?.curso || "");
  const [salvando, setSalvando] = useState(false);

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  const roleBadge = () => {
    if (user?.role === "super_admin") return { label: "Super Admin", color: "#f5a623", bg: "rgba(245,166,35,0.15)", border: "rgba(245,166,35,0.3)", Icon: ShieldCheck };
    if (user?.role === "admin") return { label: "Administrador", color: "#fb923c", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)", Icon: Shield };
    return { label: "Usuário", color: "#60a5fa", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", Icon: User };
  };

  const badge = roleBadge();
  const RoleIcon = badge.Icon;
  const inicial = user?.nome?.charAt(0).toUpperCase() || "?";

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await fetch(`${API}/api/auth/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ nome, turma, curso }),
      });

      if (res.ok) {
        // Atualiza o usuário no localStorage com os novos dados
        const stored = localStorage.getItem("tcc_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          localStorage.setItem("tcc_user", JSON.stringify({ ...parsed, nome, turma, curso }));
        }
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen" style={{ background: "#060e1f" }}>

      {/* Header */}
      <div
        className="px-5 pt-8 pb-6"
        style={{ background: "linear-gradient(160deg,#0a1628,#0d2550 60%,#060e1f)" }}
      >
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#60a5fa" }}>
            Minha Conta
          </p>

          {/* Avatar + info */}
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shrink-0 relative"
              style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}
            >
              {inicial}
              <div
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center"
                style={{ background: "#060e1f", border: "2px solid #0d2550" }}
              >
                <RoleIcon style={{ height: 12, width: 12, color: badge.color }} />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">{user?.nome}</h1>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{user?.email}</p>
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

        {/* Formulário de edição */}
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Pencil style={{ height: 15, width: 15, color: "#60a5fa" }} />
            <p className="text-sm font-semibold text-white">Editar Perfil</p>
          </div>

          <form onSubmit={salvar} className="space-y-4">
            <Field label="Nome de exibição" icon={<User style={{ height: 11, width: 11 }} />}>
              <StyledInput
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Seu nome completo"
              />
            </Field>

            <Field label="Curso" icon={<BookOpen style={{ height: 11, width: 11 }} />}>
              <StyledSelect value={curso} onChange={(e) => setCurso(e.target.value)}>
                <option value="">Selecione seu curso</option>
                {cursos.map((c) => <option key={c} value={c}>{c}</option>)}
              </StyledSelect>
            </Field>

            <Field label="Turma" icon={<GraduationCap style={{ height: 11, width: 11 }} />}>
              <StyledSelect value={turma} onChange={(e) => setTurma(e.target.value)}>
                <option value="">Selecione sua turma</option>
                {turmas.map((t) => <option key={t} value={t}>{t}</option>)}
              </StyledSelect>
            </Field>

            <button
              type="submit"
              disabled={salvando}
              className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg,#1a4fa0,#2563eb)",
                boxShadow: "0 4px 20px rgba(37,99,235,0.25)",
              }}
            >
              {salvando ? (
                <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Salvando...</>
              ) : (
                <><Pencil style={{ height: 15, width: 15 }} /> Salvar Alterações</>
              )}
            </button>
          </form>
        </div>

        {/* Info somente leitura */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Informações da Conta</p>
          {[
            { label: "E-mail", value: user?.email },
            { label: "Nível de acesso", value: badge.label },
            { label: "Curso", value: (user as any)?.curso || curso || "—" },
            { label: "Turma", value: (user as any)?.turma || turma || "—" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-xs text-white/40">{label}</span>
              <span className="text-xs font-medium text-white/80">{value}</span>
            </div>
          ))}
        </div>

        {/* Botão sair */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <LogOut style={{ height: 15, width: 15 }} />
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

export default Perfil;