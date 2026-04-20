import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mail, Lock, Eye, EyeOff, User, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const API = "http://localhost:3001/api";

const Solicitar = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/solicitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Erro", description: data.error, variant: "destructive" });
      } else {
        setEnviado(true);
      }
    } catch {
      toast({ title: "Erro", description: "Não foi possível conectar ao servidor.", variant: "destructive" });
    }

    setLoading(false);
  };

  if (enviado) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-4 text-center"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Solicitação Enviada!</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sua solicitação foi enviada ao administrador. Você receberá acesso assim que for aprovado.
          </p>
          <Link to="/login">
            <Button variant="gold">Voltar ao Login</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mb-4">
            <BookOpen className="h-7 w-7 text-accent" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Solicitar Acesso</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preencha seus dados. O administrador irá aprovar seu acesso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/40 bg-card/50 p-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="nome"
                type="text"
                placeholder="Seu nome"
                className="pl-10 bg-background border-border/40"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10 bg-background border-border/40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 bg-background border-border/40"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Já tem acesso?{" "}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Solicitar;