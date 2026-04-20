import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);

    if (result.ok) {
      toast({ title: "Bem-vindo!", description: "Login realizado com sucesso." });
      navigate("/");
    } else {
      toast({ title: "Erro ao entrar", description: result.error, variant: "destructive" });
    }

    setLoading(false);
  };

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
          <h1 className="font-serif text-2xl font-bold text-foreground">Entrar</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse sua conta no TCC Digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border/40 bg-card/50 p-6">
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
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="flex flex-col gap-1 mt-4 text-center text-sm text-muted-foreground">
          <span>
            Não tem conta?{" "}
            <Link to="/cadastro" className="text-accent hover:underline font-medium">
              Cadastre-se
            </Link>
          </span>
          <span>
            Quer acesso como administrador?{" "}
            <Link to="/solicitar" className="text-accent hover:underline font-medium">
              Solicitar acesso
            </Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;