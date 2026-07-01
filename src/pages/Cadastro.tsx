import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { cadastro } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // ── theme tokens ──
  const pageBg = isDark ? "#060e1f" : "#f0f4f8";
  const cardBg = isDark ? "rgba(17,31,56,0.5)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textMain = isDark ? "#ffffff" : "#0d1b2a";
  const textMuted = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const iconBadgeBg = isDark ? "rgba(184,134,11,0.1)" : "rgba(184,134,11,0.1)";
  const iconBadgeBorder = isDark ? "rgba(184,134,11,0.2)" : "rgba(184,134,11,0.25)";
  const roleBadgeBg = isDark ? "rgba(59,130,246,0.12)" : "#eff6ff";
  const roleBadgeColor = isDark ? "#60a5fa" : "#1d4ed8";
  const roleBadgeBorder = isDark ? "rgba(96,165,250,0.25)" : "#bfdbfe";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await cadastro(nome, email, password);

    if (result.ok) {
      toast({ title: "Conta criada!", description: "Bem-vindo ao TCC Digital." });
      navigate("/");
    } else {
      toast({ title: "Erro ao cadastrar", description: result.error, variant: "destructive" });
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
            <BookOpen className="h-7 w-7" style={{ color: "#b8860b" }} />
          </div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: textMain }}>Criar Conta</h1>
          <p className="text-sm mt-1" style={{ color: textMuted }}>Acesse o acervo de TCCs do CEEP</p>

          {/* Badge: tipo de conta */}
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: roleBadgeBg, color: roleBadgeColor, border: `1px solid ${roleBadgeBorder}` }}>
            <User className="h-3 w-3" />
            Usuário Comum
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: textMuted }}>Nome completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: textMuted }} />
              <input
                type="text"
                placeholder="Seu nome"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: textMain }}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          </div>

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
            {loading ? "Criando conta..." : "Criar Conta"}
          </Button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: textMuted }}>
          Já tem conta?{" "}
          <Link to="/login" className="font-medium hover:underline" style={{ color: "#b8860b" }}>
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Cadastro;
