import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getToken } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, UserPlus, BookOpen, Pencil } from "lucide-react";

const API = "http://localhost:8080";
const cursos = ["Informática", "Redes de Computadores"];

const Admin = () => {
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tccs, setTccs] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  const [tccForm, setTccForm] = useState({ titulo: "", autor: "", curso: "Informática", ano: new Date().getFullYear().toString(), resumo: "", tipo: "tcc" });
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [salvandoTcc, setSalvandoTcc] = useState(false);

  const [userForm, setUserForm] = useState({ nome: "", email: "", password: "", role: "user" });
  const [salvandoUser, setSalvandoUser] = useState(false);

  const [novoNome, setNovoNome] = useState(user?.nome || "");
  const [salvandoNome, setSalvandoNome] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate("/"); return; }
    carregarTccs();
    if (isSuperAdmin) carregarUsuarios();
  }, [isAdmin]);

  const carregarTccs = () =>
    fetch(`${API}/tccs`).then((r) => r.json()).then(setTccs);

  const carregarUsuarios = () =>
    fetch(`${API}/admin/usuarios`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((r) => r.json()).then(setUsuarios);

  const salvarTcc = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoTcc(true);
    const form = new FormData();
    Object.entries(tccForm).forEach(([k, v]) => form.append(k, v));
    if (arquivo) form.append("arquivo", arquivo);

    const res = await fetch(`${API}/tccs`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    });

    if (res.ok) {
      toast({ title: "TCC adicionado com sucesso!" });
      setTccForm({ titulo: "", autor: "", curso: "Informática", ano: new Date().getFullYear().toString(), resumo: "", tipo: "tcc" });
      setArquivo(null);
      carregarTccs();
    } else {
      const data = await res.json();
      toast({ title: "Erro", description: data.error, variant: "destructive" });
    }
    setSalvandoTcc(false);
  };

  const deletarTcc = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este TCC?")) return;
    await fetch(`${API}/tccs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    toast({ title: "TCC removido." });
    carregarTccs();
  };

  const criarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoUser(true);
    const res = await fetch(`${API}/auth/cadastro`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(userForm),
    });

    if (res.ok) {
      const data = await res.json();
      if (userForm.role === "admin") {
        await fetch(`${API}/admin/usuarios/${data.user.id}/role`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({ role: "admin" }),
        });
      }
      toast({ title: "Usuário criado com sucesso!" });
      setUserForm({ nome: "", email: "", password: "", role: "user" });
      carregarUsuarios();
    } else {
      const data = await res.json();
      toast({ title: "Erro", description: data.error, variant: "destructive" });
    }
    setSalvandoUser(false);
  };

  const deletarUsuario = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;
    await fetch(`${API}/admin/usuarios/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    toast({ title: "Usuário removido." });
    carregarUsuarios();
  };

  const salvarNome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoNome(true);
    const res = await fetch(`${API}/admin/usuarios/${user?.id}/nome`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ nome: novoNome }),
    });
    if (res.ok) {
      toast({ title: "Nome atualizado! Faça login novamente para ver a mudança." });
    } else {
      toast({ title: "Erro ao atualizar nome.", variant: "destructive" });
    }
    setSalvandoNome(false);
  };

  const roleLabel = (role: string) => {
    if (role === "super_admin") return "super admin";
    if (role === "admin") return "admin";
    return "user";
  };

  const roleColor = (role: string) => {
    if (role === "super_admin") return "text-yellow-500 font-bold";
    if (role === "admin") return "text-accent font-semibold";
    return "";
  };

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="font-serif text-3xl font-bold mb-2 text-foreground">Painel Admin</h1>
      <p className="text-muted-foreground mb-8 text-sm">
        {isSuperAdmin ? "Super Administrador — controle total" : "Administrador — gerenciamento de TCCs"}
      </p>

      <Tabs defaultValue="tccs">
        <TabsList className="mb-6">
          <TabsTrigger value="tccs"><BookOpen className="h-4 w-4 mr-1" />TCCs</TabsTrigger>
          {/* Aba de usuários: só super_admin vê */}
          {isSuperAdmin && (
            <TabsTrigger value="usuarios"><UserPlus className="h-4 w-4 mr-1" />Usuários</TabsTrigger>
          )}
          {/* Aba de perfil: só super_admin vê */}
          {isSuperAdmin && (
            <TabsTrigger value="perfil"><Pencil className="h-4 w-4 mr-1" />Meu Perfil</TabsTrigger>
          )}
        </TabsList>

        {/* ABA TCCS — todos os admins veem */}
        <TabsContent value="tccs" className="space-y-8">
          <div className="rounded-xl border border-border/40 bg-card/50 p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Plus className="h-5 w-5" />Adicionar TCC</h2>
            <form onSubmit={salvarTcc} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Título *</Label>
                  <Input value={tccForm.titulo} onChange={(e) => setTccForm({ ...tccForm, titulo: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label>Autor *</Label>
                  <Input value={tccForm.autor} onChange={(e) => setTccForm({ ...tccForm, autor: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label>Curso *</Label>
                  <select className="w-full border border-border/40 rounded-md px-3 py-2 text-sm bg-background"
                    value={tccForm.curso} onChange={(e) => setTccForm({ ...tccForm, curso: e.target.value })}>
                    {cursos.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Ano *</Label>
                  <Input type="number" value={tccForm.ano} onChange={(e) => setTccForm({ ...tccForm, ano: e.target.value })} required />
                </div>
                <div className="space-y-1">
                  <Label>Tipo</Label>
                  <select className="w-full border border-border/40 rounded-md px-3 py-2 text-sm bg-background"
                    value={tccForm.tipo} onChange={(e) => setTccForm({ ...tccForm, tipo: e.target.value })}>
                    <option value="tcc">TCC</option>
                    <option value="apostila">Apostila</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Arquivo PDF</Label>
                  <Input type="file" accept="application/pdf" onChange={(e) => setArquivo(e.target.files?.[0] || null)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Resumo</Label>
                <textarea className="w-full border border-border/40 rounded-md px-3 py-2 text-sm bg-background min-h-[80px]"
                  value={tccForm.resumo} onChange={(e) => setTccForm({ ...tccForm, resumo: e.target.value })} />
              </div>
              <Button type="submit" variant="gold" disabled={salvandoTcc}>
                {salvandoTcc ? "Salvando..." : "Adicionar TCC"}
              </Button>
            </form>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/50 p-6">
            <h2 className="font-semibold text-lg mb-4">TCCs Cadastrados ({tccs.length})</h2>
            <div className="space-y-2">
              {tccs.map((tcc) => (
                <div key={tcc.id} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-background">
                  <div>
                    <p className="font-medium text-sm text-foreground">{tcc.titulo}</p>
                    <p className="text-xs text-muted-foreground">{tcc.autor} · {tcc.curso} · {tcc.ano}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deletarTcc(tcc.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {tccs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nenhum TCC cadastrado ainda.</p>}
            </div>
          </div>
        </TabsContent>

        {/* ABA USUÁRIOS — só super_admin */}
        {isSuperAdmin && (
          <TabsContent value="usuarios" className="space-y-8">
            <div className="rounded-xl border border-border/40 bg-card/50 p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><UserPlus className="h-5 w-5" />Criar Usuário</h2>
              <form onSubmit={criarUsuario} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Nome completo *</Label>
                    <Input value={userForm.nome} onChange={(e) => setUserForm({ ...userForm, nome: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <Label>E-mail *</Label>
                    <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Senha *</Label>
                    <Input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required />
                  </div>
                  <div className="space-y-1">
                    <Label>Tipo</Label>
                    <select className="w-full border border-border/40 rounded-md px-3 py-2 text-sm bg-background"
                      value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                      <option value="user">Usuário comum</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" variant="gold" disabled={salvandoUser}>
                  {salvandoUser ? "Criando..." : "Criar Usuário"}
                </Button>
              </form>
            </div>

            <div className="rounded-xl border border-border/40 bg-card/50 p-6">
              <h2 className="font-semibold text-lg mb-4">Usuários Cadastrados ({usuarios.length})</h2>
              <div className="space-y-2">
                {usuarios.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-background">
                    <div>
                      <p className="font-medium text-sm text-foreground">{u.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {u.email} · <span className={roleColor(u.role)}>{roleLabel(u.role)}</span>
                      </p>
                    </div>
                    {u.id !== user?.id && u.role !== "super_admin" && (
                      <Button variant="ghost" size="sm" onClick={() => deletarUsuario(u.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        )}

        {/* ABA PERFIL — só super_admin */}
        {isSuperAdmin && (
          <TabsContent value="perfil">
            <div className="rounded-xl border border-border/40 bg-card/50 p-6 max-w-md">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2"><Pencil className="h-5 w-5" />Editar Meu Nome</h2>
              <form onSubmit={salvarNome} className="space-y-4">
                <div className="space-y-1">
                  <Label>Nome de exibição</Label>
                  <Input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} required />
                </div>
                <Button type="submit" variant="gold" disabled={salvandoNome}>
                  {salvandoNome ? "Salvando..." : "Salvar Nome"}
                </Button>
              </form>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Admin;