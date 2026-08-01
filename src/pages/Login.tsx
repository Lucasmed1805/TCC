import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // ── theme tokens ──
  const pageBg = isDark ? "#0b1220" : "#ffffff";
  const cardBg = isDark ? "rgba(17,31,56,0.5)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const textMain = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.65)";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)";
  const iconBadgeBg = isDark ? "rgba(29,78,216,0.1)" : "rgba(29,78,216,0.1)";
  const iconBadgeBorder = isDark ? "rgba(29,78,216,0.2)" : "rgba(29,78,216,0.25)";

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
    <div className="min-h-[80vh] flex items-center justify-center py-12 transition-colors" style={{ background: pageBg }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-4"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl mb-4"
            style={{ background: iconBadgeBg, border: `1px solid ${iconBadgeBorder}` }}>
            <BookOpen className="h-7 w-7" style={{ color: "#1d4ed8" }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: textMain }}>Entrar</h1>
          <p className="text-sm mt-1" style={{ color: textMuted }}>Acesse sua conta no TCC Digital</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: textMuted }} />
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: textMuted }} />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: textMuted }}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="flex flex-col gap-1 mt-4 text-center text-sm" style={{ color: textMuted }}>
          <span>
            Não tem conta?{" "}
            <Link to="/cadastro" className="font-medium hover:underline" style={{ color: "#1d4ed8" }}>
              Cadastre-se
            </Link>
          </span>
          <span>
            Quer acesso como administrador?{" "}
            <Link to="/solicitar" className="font-medium hover:underline" style={{ color: "#1d4ed8" }}>
              Solicitar acesso
            </Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;