import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getToken } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/ThemeContext";
import { Trash2, Plus, UserPlus, BookOpen, Pencil, ChevronDown, ChevronUp, Users, Settings, ShieldCheck, Shield, User } from "lucide-react";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}`;
const cursos = ["Informática", "Redes de Computadores"];

const Admin = () => {
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDark } = useTheme();

  // ── theme tokens ──
  const pageBg = isDark ? "#060e1f" : "#f0f4f8";
  const heroBg = isDark
    ? "linear-gradient(160deg,#0a1628,#0d2550 60%,#060e1f)"
    : "linear-gradient(160deg,#dce8f8,#c8dcf0 60%,#dce8f8)";
  const textMain = isDark ? "#ffffff" : "#0d1b2a";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)";
  const textFaint = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)";
  const textFainter = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)";
  const cardBg = isDark ? "#111f38" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const dividerColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const tabIdleBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const tabIdleColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)";
  const tabIdleBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const iconChipBg = isDark ? "rgba(37,99,235,0.2)" : "rgba(37,99,235,0.12)";
  const iconChipColor = isDark ? "#60a5fa" : "#2563eb";
  const rowHoverBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const rowCardInner = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)";
  const rowCardInnerBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const rowCreateBg = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)";
  const fileDashedBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const fileDashedBorder = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
  const badgeCountBg = isDark ? "rgba(26,79,160,0.3)" : "rgba(26,79,160,0.12)";
  const badgeCountColor = isDark ? "#60a5fa" : "#1a4fa0";

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all";
  const inputStyle = { background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}`, color: textMain };
  const inputFocusStyle = { background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", border: "1px solid rgba(96,165,250,0.4)", color: textMain };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>{label}</label>
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
      style={inputStyle}>
      {children}
    </select>
  );

  const [aba, setAba] = useState<"tccs" | "usuarios" | "perfil">("tccs");
  const [tccs, setTccs] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [formAberto, setFormAberto] = useState(false);
  const [criarAberto, setCriarAberto] = useState(false);

  const [listaUsuariosAberta, setListaUsuariosAberta] = useState(false);

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
      .then((r) => r.json())
      .then((data) => {
        setUsuarios(Array.isArray(data) ? data : []);
      })
      .catch(() => setUsuarios([]));

  const salvarTcc = async (e: React.FormEvent) => {
    e.preventDefault();

    if (arquivo && arquivo.size > 50 * 1024 * 1024) {
      toast({ title: "Erro", description: "Arquivo muito grande! Máximo 50MB", variant: "destructive" });
      return;
    }

    setSalvandoTcc(true);
    const form = new FormData();
    Object.entries(tccForm).forEach(([k, v]) => form.append(k, v));
    if (arquivo) form.append("arquivo", arquivo);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${API}/api/tccs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        toast({ title: "✅ TCC adicionado com sucesso!" });
        setTccForm({ titulo: "", autor: "", curso: "Informática", ano: new Date().getFullYear().toString(), resumo: "", tipo: "tcc" });
        setArquivo(null);
        setFormAberto(false);
        carregarTccs();
      } else {
        const data = await res.json();
        toast({ title: "Erro", description: data.error || "Erro ao salvar TCC", variant: "destructive" });
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast({ title: "Erro", description: "Requisição expirou. Tente novamente.", variant: "destructive" });
      } else {
        toast({ title: "Erro", description: "Erro na conexão com o servidor", variant: "destructive" });
      }
    } finally {
      setSalvandoTcc(false);
    }
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
    <div className="min-h-screen transition-colors" style={{ background: pageBg }}>

      {/* Header */}
      <div className="px-5 pt-8 pb-5" style={{ background: heroBg }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#f5a623" }}>
          {isSuperAdmin ? "Super Administrador" : "Administrador"}
        </p>
        <h1 className="text-2xl font-extrabold" style={{ color: textMain }}>Painel Admin</h1>
        <p className="text-sm mt-0.5" style={{ color: textMuted }}>
          {isSuperAdmin ? "Controle total do sistema" : "Gerenciamento de TCCs"}
        </p>

        {/* Tabs */}
        <div className="mt-5 flex gap-2">
          {abas.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setAba(id as any)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={aba === id
                ? { background: "#1a4fa0", color: "white", border: "1px solid #2563eb" }
                : { background: tabIdleBg, color: tabIdleColor, border: `1px solid ${tabIdleBorder}` }}>
              <Icon style={{ height: 14, width: 14 }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-6 pb-10 max-w-2xl mx-auto space-y-4">

        {/* ── ABA TCCs ── */}
        {aba === "tccs" && (
          <>
            <button onClick={() => setFormAberto(!formAberto)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: iconChipBg }}>
                  <Plus style={{ height: 18, width: 18, color: iconChipColor }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: textMain }}>Adicionar novo TCC</span>
              </div>
              {formAberto
                ? <ChevronUp style={{ height: 18, width: 18, color: textMuted }} />
                : <ChevronDown style={{ height: 18, width: 18, color: textMuted }} />}
            </button>

            {formAberto && (
              <div className="rounded-2xl p-5 space-y-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
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
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Arquivo PDF">
                    <div className="rounded-xl px-4 py-3 text-sm" style={{ background: fileDashedBg, border: `1px dashed ${fileDashedBorder}`, color: textMuted }}>
                      <input type="file" accept="application/pdf"
                        onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                        className="w-full text-xs" style={{ color: textFaint }} />
                      {arquivo && <p className="text-xs text-green-400 mt-1">✓ {arquivo.name} ({(arquivo.size / 1024 / 1024).toFixed(2)}MB)</p>}
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

            <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                <p className="text-sm font-semibold" style={{ color: textMain }}>TCCs Cadastrados</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: badgeCountBg, color: badgeCountColor }}>{tccs.length}</span>
              </div>
              {tccs.length === 0 ? (
                <p className="text-sm text-center py-10" style={{ color: textFainter }}>Nenhum TCC cadastrado ainda.</p>
              ) : (
                <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                  {tccs.map((tcc, idx) => (
                    <div key={tcc._id || tcc.id} className="flex items-center gap-3 px-5 py-4"
                      style={{ borderTop: idx === 0 ? "none" : `1px solid ${dividerColor}` }}>
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconChipBg }}>
                        <BookOpen style={{ height: 16, width: 16, color: iconChipColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: textMain }}>{tcc.titulo}</p>
                        <p className="text-xs truncate" style={{ color: textMuted }}>{tcc.autor} · {tcc.curso} · {tcc.ano}</p>
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
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Super Admin", count: superAdmins.length, color: "#f5a623", bg: "rgba(245,166,35,0.1)", border: "rgba(245,166,35,0.2)" },
                { label: "Admins", count: admins.length, color: "#fb923c", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)" },
                { label: "Usuários", count: usersComuns.length, color: "#60a5fa", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
              ].map(({ label, count, color, bg, border }) => (
                <div key={label} className="rounded-2xl p-4 text-center"
                  style={{ background: bg, border: `1px solid ${border}` }}>
                  <p className="text-2xl font-extrabold" style={{ color }}>{count}</p>
                  <p className="text-[10px] font-semibold mt-0.5" style={{ color: textMuted }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <button
                onClick={() => {
                  setListaUsuariosAberta(!listaUsuariosAberta);
                  if (listaUsuariosAberta) setCriarAberto(false);
                }}
                className="w-full px-5 py-4 flex items-center justify-between transition-all"
                style={{ borderBottom: listaUsuariosAberta ? `1px solid ${dividerColor}` : "none" }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: iconChipBg }}>
                    <Users style={{ height: 16, width: 16, color: iconChipColor }} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold" style={{ color: textMain }}>Todos os Usuários</p>
                    <p className="text-xs mt-0.5" style={{ color: textFaint }}>
                      {listaUsuariosAberta ? "Clique para recolher" : `${usuarios.length} usuário${usuarios.length !== 1 ? "s" : ""} cadastrado${usuarios.length !== 1 ? "s" : ""}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: badgeCountBg, color: badgeCountColor }}>
                    {usuarios.length}
                  </span>
                  {listaUsuariosAberta
                    ? <ChevronUp style={{ height: 18, width: 18, color: textMuted }} />
                    : <ChevronDown style={{ height: 18, width: 18, color: textMuted }} />}
                </div>
              </button>

              {listaUsuariosAberta && (
                <>
                  <div className="px-5 py-3 flex justify-start" style={{ borderBottom: `1px solid ${dividerColor}` }}>
                    <button
                      onClick={() => setCriarAberto(!criarAberto)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: criarAberto ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.15)",
                        color: "#60a5fa",
                        border: "1px solid rgba(37,99,235,0.3)",
                      }}>
                      <UserPlus style={{ height: 12, width: 12 }} />
                      {criarAberto ? "Cancelar" : "Criar Usuário"}
                    </button>
                  </div>

                  {criarAberto && (
                    <div className="px-5 py-4 space-y-3" style={{ borderBottom: `1px solid ${dividerColor}`, background: rowCreateBg }}>
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

                  {usuarios.length === 0 ? (
                    <p className="text-sm text-center py-10" style={{ color: textFainter }}>Nenhum usuário cadastrado.</p>
                  ) : (
                    <div className="overflow-y-scroll"
                      style={{ height: "320px", scrollbarWidth: "thin", scrollbarColor: "rgba(96,165,250,0.25) transparent" }}>
                      {usuarios.map((u, idx) => {
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
                          <div key={uid} style={{ borderTop: idx === 0 ? "none" : `1px solid ${dividerColor}` }}>
                            <button
                              onClick={() => setExpandidoId(expandido ? null : uid)}
                              className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all"
                              style={{ background: expandido ? rowHoverBg : "transparent" }}>
                              <div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white relative"
                                style={{ background: badge.avatarBg }}>
                                {u.nome?.charAt(0).toUpperCase()}
                                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center"
                                  style={{ background: cardBg }}>
                                  <RoleIcon style={{ height: 10, width: 10, color: badge.iconColor }} />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-semibold truncate" style={{ color: textMain }}>{u.nome}</p>
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
                                <p className="text-xs mt-0.5" style={{ color: textMuted }}>{u.email}</p>
                              </div>
                              <ChevronDown style={{
                                height: 14, width: 14,
                                color: textFainter,
                                transform: expandido ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s",
                                flexShrink: 0,
                              }} />
                            </button>

                            {expandido && (
                              <div className="px-5 pb-4 space-y-3"
                                style={{ borderTop: `1px solid ${dividerColor}`, background: rowCreateBg }}>
                                <div className="rounded-xl p-3 space-y-2 mt-2"
                                  style={{ background: rowCardInner, border: `1px solid ${rowCardInnerBorder}` }}>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: textFainter }}>E-mail</span>
                                    <span className="text-xs" style={{ color: textFaint }}>{u.email}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: textFainter }}>Cadastrado em</span>
                                    <span className="text-xs" style={{ color: textFaint }}>{dataFormatada}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: textFainter }}>Nível de acesso</span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={badge.style}>{badge.label}</span>
                                  </div>
                                </div>

                                {!isSelf && !isProtected && (
                                  <div className="flex flex-col gap-2">
                                    {u.role === "user" && (
                                      <button
                                        onClick={() => navigate(`/perfil/${uid}`)}
                                        className="w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                        style={{ background: "rgba(96,165,250,0.12)", color: "#93c5fd", border: "1px solid rgba(96,165,250,0.25)" }}>
                                        <User style={{ height: 13, width: 13 }} />
                                        Ver Perfil
                                      </button>
                                    )}
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
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* ── ABA PERFIL ── */}
        {aba === "perfil" && isSuperAdmin && (
          <div className="rounded-2xl p-5 space-y-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: textMain }}>
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
