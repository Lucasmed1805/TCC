import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getToken } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, UserPlus, BookOpen, Pencil, ChevronDown, ChevronUp, Users, Settings, ShieldCheck, Shield, User } from "lucide-react";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}`;
const cursos = ["Informática", "Redes de Computadores"];

const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all";
const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" };
const inputFocusStyle = { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(96,165,250,0.4)" };

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</label>
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
    style={{ ...inputStyle, color: "white" }}>
    {children}
  </select>
);

const Admin = () => {
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [aba, setAba] = useState<"tccs" | "usuarios" | "perfil">("tccs");
  const [tccs, setTccs] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [formAberto, setFormAberto] = useState(false);
  const [criarAberto, setCriarAberto] = useState(false);

  const [tccForm, setTccForm] = useState({
    titulo: "", autor: "", curso: "Informática",
    ano: new Date().getFullYear().toString(), resumo: "", tipo: "tcc"
  });
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [salvandoTcc, setSalvandoTcc] = useState(false);

  const [userForm, setUserForm] = useState({ nome: "", email: "", password: "", role: "user" });
  const [salvandoUser, setSalvandoUser] = useState(false);

  const [novoNome, setNovoNome] = useState(user?.nome || "");
  const [salvandoNome, setSalvandoNome] = useState(false);

  const [expandidoId, setExpandidoId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) { navigate("/"); return; }
    carregarTccs();
    if (isSuperAdmin) carregarUsuarios();
  }, [isAdmin]);

  const carregarTccs = () =>
    fetch(`${API}/api/tccs`).then((r) => r.json()).then(setTccs).catch(() => {});

  const carregarUsuarios = () =>
    fetch(`${API}/api/admin/usuarios`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json()).then(setUsuarios).catch(() => {});

  const salvarTcc = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoTcc(true);
    const form = new FormData();
    Object.entries(tccForm).forEach(([k, v]) => form.append(k, v));
    if (arquivo) form.append("arquivo", arquivo);
    const res = await fetch(`${API}/api/tccs`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    });
    if (res.ok) {
      toast({ title: "✅ TCC adicionado com sucesso!" });
      setTccForm({ titulo: "", autor: "", curso: "Informática", ano: new Date().getFullYear().toString(), resumo: "", tipo: "tcc" });
      setArquivo(null);
      setFormAberto(false);
      carregarTccs();
    } else {
      const data = await res.json();
      toast({ title: "Erro", description: data.error, variant: "destructive" });
    }
    setSalvandoTcc(false);
  };

  const deletarTcc = async (id: string) => {
    if (!confirm("Remover este TCC?")) return;
    await fetch(`${API}/api/tccs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    toast({ title: "TCC removido." });
    carregarTccs();
  };

  const criarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoUser(true);
    const res = await fetch(`${API}/api/auth/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(userForm),
    });
    if (res.ok) {
      const data = await res.json();
      if (userForm.role === "admin") {
        await fetch(`${API}/api/admin/usuarios/${data.user.id}/role`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ role: "admin" }),
        });
      }
      toast({ title: "✅ Usuário criado com sucesso!" });
      setUserForm({ nome: "", email: "", password: "", role: "user" });
      setCriarAberto(false);
      carregarUsuarios();
    } else {
      const data = await res.json();
      toast({ title: "Erro", description: data.error, variant: "destructive" });
    }
    setSalvandoUser(false);
  };

  const deletarUsuario = async (id: string) => {
    if (!confirm("Remover este usuário?")) return;
    await fetch(`${API}/api/admin/usuarios/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    toast({ title: "Usuário removido." });
    carregarUsuarios();
  };

  const alterarRole = async (id: string, nomeUsuario: string, roleAtual: string) => {
    const novaRole = roleAtual === "admin" ? "user" : "admin";
    await fetch(`${API}/api/admin/usuarios/${id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ role: novaRole }),
    });
    toast({ title: `✅ ${nomeUsuario} agora é ${novaRole === "admin" ? "Administrador" : "Usuário comum"}.` });
    carregarUsuarios();
  };

  const salvarNome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoNome(true);
    const res = await fetch(`${API}/api/admin/usuarios/${user?.id}/nome`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ nome: novoNome }),
    });
    if (res.ok) toast({ title: "✅ Nome atualizado! Faça login novamente." });
    else toast({ title: "Erro ao atualizar nome.", variant: "destructive" });
    setSalvandoNome(false);
  };

  const roleBadge = (role: string) => {
    if (role === "super_admin") return {
      label: "Super Admin",
      style: { background: "rgba(245,166,35,0.15)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.3)" },
      avatarBg: "rgba(245,166,35,0.2)",
      Icon: ShieldCheck,
      iconColor: "#f5a623",
    };
    if (role === "admin") return {
      label: "Admin",
      style: { background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.3)" },
      avatarBg: "rgba(249,115,22,0.2)",
      Icon: Shield,
      iconColor: "#fb923c",
    };
    return {
      label: "Usuário",
      style: { background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" },
      avatarBg: "rgba(59,130,246,0.2)",
      Icon: User,
      iconColor: "#60a5fa",
    };
  };

  const abas = [
    { id: "tccs", label: "TCCs", Icon: BookOpen },
    ...(isSuperAdmin ? [{ id: "usuarios", label: "Usuários", Icon: Users }] : []),
    ...(isSuperAdmin ? [{ id: "perfil", label: "Perfil", Icon: Settings }] : []),
  ] as const;

  const btnPrimary = "w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60";

  const superAdmins = usuarios.filter(u => u.role === "super_admin");
  const admins = usuarios.filter(u => u.role === "admin");
  const usersComuns = usuarios.filter(u => u.role === "user");

  return (
    <div className="min-h-screen" style={{ background: "#060e1f" }}>

      {/* Header */}
      <div className="px-5 pt-8 pb-5"
        style={{ background: "linear-gradient(160deg,#0a1628,#0d2550 60%,#060e1f)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#f5a623" }}>
          {isSuperAdmin ? "Super Administrador" : "Administrador"}
        </p>
        <h1 className="text-2xl font-extrabold text-white">Painel Admin</h1>
        <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          {isSuperAdmin ? "Controle total do sistema" : "Gerenciamento de TCCs"}
        </p>

        {/* Tabs */}
        <div className="mt-5 flex gap-2">
          {abas.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setAba(id as any)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={aba === id
                ? { background: "#1a4fa0", color: "white", border: "1px solid #2563eb" }
                : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Icon style={{ height: 14, width: 14 }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-10 max-w-2xl mx-auto space-y-4">

        {/* ── ABA TCCs ── */}
        {aba === "tccs" && (
          <>
            <button onClick={() => setFormAberto(!formAberto)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all"
              style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(37,99,235,0.2)" }}>
                  <Plus style={{ height: 18, width: 18, color: "#60a5fa" }} />
                </div>
                <span className="text-sm font-semibold text-white">Adicionar novo TCC</span>
              </div>
              {formAberto
                ? <ChevronUp style={{ height: 18, width: 18, color: "rgba(255,255,255,0.4)" }} />
                : <ChevronDown style={{ height: 18, width: 18, color: "rgba(255,255,255,0.4)" }} />}
            </button>

            {formAberto && (
              <div className="rounded-2xl p-5 space-y-4"
                style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}>
                <form onSubmit={salvarTcc} className="space-y-4">
                  <Field label="Título *">
                    <StyledInput value={tccForm.titulo} onChange={(e) => setTccForm({ ...tccForm, titulo: e.target.value })} required placeholder="Título do trabalho" />
                  </Field>
                  <Field label="Autor *">
                    <StyledInput value={tccForm.autor} onChange={(e) => setTccForm({ ...tccForm, autor: e.target.value })} required placeholder="Nome do autor" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Curso *">
                      <StyledSelect value={tccForm.curso} onChange={(e) => setTccForm({ ...tccForm, curso: e.target.value })}>
                        {cursos.map((c) => <option key={c}>{c}</option>)}
                      </StyledSelect>
                    </Field>
                    <Field label="Ano *">
                      <StyledInput type="number" value={tccForm.ano} onChange={(e) => setTccForm({ ...tccForm, ano: e.target.value })} required />
                    </Field>
                  </div>
                  <Field label="Tipo">
                    <StyledSelect value={tccForm.tipo} onChange={(e) => setTccForm({ ...tccForm, tipo: e.target.value })}>
                      <option value="tcc">TCC</option>
                      <option value="apostila">Apostila</option>
                    </StyledSelect>
                  </Field>
                  <Field label="Resumo">
                    <textarea
                      value={tccForm.resumo}
                      onChange={(e) => setTccForm({ ...tccForm, resumo: e.target.value })}
                      placeholder="Resumo do trabalho..."
                      rows={3}
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Arquivo PDF">
                    <div className="rounded-xl px-4 py-3 text-sm text-white/50"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)" }}>
                      <input type="file" accept="application/pdf"
                        onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                        className="w-full text-white/60 text-xs" />
                      {arquivo && <p className="text-xs text-green-400 mt-1">✓ {arquivo.name}</p>}
                    </div>
                  </Field>
                  <button type="submit" disabled={salvandoTcc}
                    className={btnPrimary}
                    style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)", boxShadow: "0 4px 20px rgba(37,99,235,0.25)" }}>
                    {salvandoTcc ? (
                      <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Salvando...</>
                    ) : (
                      <><Plus style={{ height: 16, width: 16 }} /> Adicionar TCC</>
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className="rounded-2xl overflow-hidden"
              style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">TCCs Cadastrados</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(26,79,160,0.3)", color: "#60a5fa" }}>{tccs.length}</span>
              </div>
              {tccs.length === 0 ? (
                <p className="text-sm text-white/30 text-center py-10">Nenhum TCC cadastrado ainda.</p>
              ) : (
                <div className="divide-y divide-white/5 overflow-y-auto" style={{ maxHeight: "400px" }}>
                  {tccs.map((tcc) => (
                    <div key={tcc._id || tcc.id} className="flex items-center gap-3 px-5 py-4">
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "rgba(37,99,235,0.15)" }}>
                        <BookOpen style={{ height: 16, width: 16, color: "#60a5fa" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{tcc.titulo}</p>
                        <p className="text-xs text-white/40 truncate">{tcc.autor} · {tcc.curso} · {tcc.ano}</p>
                      </div>
                      <button onClick={() => deletarTcc(tcc._id || tcc.id)}
                        className="p-2 rounded-lg transition-colors shrink-0"
                        style={{ color: "#f87171" }}>
                        <Trash2 style={{ height: 16, width: 16 }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ABA USUÁRIOS ── */}
        {aba === "usuarios" && isSuperAdmin && (
          <>
            {/* Resumo de contagens */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Super Admin", count: superAdmins.length, color: "#f5a623", bg: "rgba(245,166,35,0.1)", border: "rgba(245,166,35,0.2)" },
                { label: "Admins", count: admins.length, color: "#fb923c", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)" },
                { label: "Usuários", count: usersComuns.length, color: "#60a5fa", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
              ].map(({ label, count, color, bg, border }) => (
                <div key={label} className="rounded-2xl p-4 text-center"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <p className="text-2xl font-extrabold" style={{ color }}>{count}</p>
                  <p className="text-[10px] font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Caixa única com header, formulário colapsável e lista com scroll */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}>

              {/* Header */}
              <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Todos os Usuários</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(26,79,160,0.3)", color: "#60a5fa" }}>{usuarios.length}</span>
                  <button
                    onClick={() => setCriarAberto(!criarAberto)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{ background: criarAberto ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.15)", color: "#60a5fa", border: "1px solid rgba(37,99,235,0.3)" }}>
                    <UserPlus style={{ height: 12, width: 12 }} />
                    {criarAberto ? "Cancelar" : "Criar"}
                  </button>
                </div>
              </div>

              {/* Formulário colapsável */}
              {criarAberto && (
                <div className="px-5 py-4 space-y-3 border-b border-white/5"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <form onSubmit={criarUsuario} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Nome *">
                        <StyledInput value={userForm.nome} onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })} required placeholder="Nome completo" />
                      </Field>
                      <Field label="E-mail *">
                        <StyledInput type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required placeholder="email@exemplo.com" />
                      </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Senha *">
                        <StyledInput type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required placeholder="Mínimo 6 caracteres" />
                      </Field>
                      <Field label="Tipo">
                        <StyledSelect value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                          <option value="user">Usuário comum</option>
                          <option value="admin">Administrador</option>
                        </StyledSelect>
                      </Field>
                    </div>
                    <button type="submit" disabled={salvandoUser} className={btnPrimary}
                      style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}>
                      {salvandoUser ? "Criando..." : <><UserPlus style={{ height: 16, width: 16 }} /> Criar Usuário</>}
                    </button>
                  </form>
                </div>
              )}

              {/* Lista com scroll */}
              {usuarios.length === 0 ? (
                <p className="text-sm text-white/30 text-center py-10">Nenhum usuário cadastrado.</p>
              ) : (
                <div className="divide-y divide-white/5 overflow-y-auto" style={{ maxHeight: "280px"}}>
                  {usuarios.map((u) => {
                    const badge = roleBadge(u.role);
                    const RoleIcon = badge.Icon;
                    const isSelf = (u._id || u.id) === user?.id;
                    const isProtected = u.role === "super_admin";
                    const uid = u._id || u.id;
                    const expandido = expandidoId === uid;
                    const dataFormatada = u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
                      : "—";

                    return (
                      <div key={uid}>
                        <button
                          onClick={() => setExpandidoId(expandido ? null : uid)}
                          className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all"
                          style={{ background: expandido ? "rgba(255,255,255,0.03)" : "transparent" }}>

                          <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white relative"
                            style={{ background: badge.avatarBg }}>
                            {u.nome?.charAt(0).toUpperCase()}
                            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center"
                              style={{ background: "#111f38" }}>
                              <RoleIcon style={{ height: 10, width: 10, color: badge.iconColor }} />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-white truncate">{u.nome}</p>
                              {isSelf && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                  style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }}>
                                  Você
                                </span>
                              )}
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={badge.style}>
                                {badge.label}
                              </span>
                            </div>
                            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{u.email}</p>
                          </div>

                          <ChevronDown style={{
                            height: 14, width: 14,
                            color: "rgba(255,255,255,0.3)",
                            transform: expandido ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                            flexShrink: 0,
                          }} />
                        </button>

                        {expandido && (
                          <div className="px-5 pb-4 space-y-3"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)" }}>
                            <div className="rounded-xl p-3 space-y-2 mt-2"
                              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>E-mail</span>
                                <span className="text-xs text-white/70">{u.email}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Cadastrado em</span>
                                <span className="text-xs text-white/70">{dataFormatada}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Nível de acesso</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={badge.style}>{badge.label}</span>
                              </div>
                            </div>

                            {!isSelf && !isProtected && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => alterarRole(uid, u.nome, u.role)}
                                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                                  style={u.role === "admin"
                                    ? { background: "rgba(249,115,22,0.15)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.25)" }
                                    : { background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" }}>
                                  {u.role === "admin" ? "↓ Rebaixar para Usuário" : "↑ Promover para Admin"}
                                </button>
                                <button
                                  onClick={() => deletarUsuario(uid)}
                                  className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                                  style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
                                  <Trash2 style={{ height: 14, width: 14 }} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ABA PERFIL ── */}
        {aba === "perfil" && isSuperAdmin && (
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <Pencil style={{ height: 16, width: 16, color: "#60a5fa" }} /> Editar Meu Nome
            </p>
            <form onSubmit={salvarNome} className="space-y-4">
              <Field label="Nome de exibição">
                <StyledInput value={novoNome} onChange={(e) => setNovoNome(e.target.value)} required />
              </Field>
              <button type="submit" disabled={salvandoNome} className={btnPrimary}
                style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}>
                {salvandoNome ? "Salvando..." : "Salvar Nome"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;