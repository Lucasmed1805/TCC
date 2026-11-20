import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, BookOpen, GraduationCap } from "lucide-react";
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
    <div className="min-h-screen flex" style={{ background: "#060e1f" }}>

      {/* Lado esquerdo — visual */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#0a1628 0%,#0d2550 60%,#060e1f 100%)" }}>

        {/* Grid de pontos */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(37,99,235,0.2) 0%,transparent 70%)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(96,165,250,0.3)" }}>
            <BookOpen style={{ height: 20, width: 20, color: "#60a5fa" }} />
          </div>
          <div>
            <p className="text-white font-bold text-sm">TCC Digital</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>CEEP</p>
          </div>
        </div>

        {/* Texto central */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)", color: "#f5a623" }}>
            <GraduationCap style={{ height: 12, width: 12 }} />
            Biblioteca Digital CEEP
          </div>

          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Seu Repositório<br />
            <span style={{ color: "#3b82f6" }}>Digital de TCCs</span><br />
            <span style={{ color: "#f5a623" }}>e Apostilas</span>
          </h1>

          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Acesse, guarde e compartilhe trabalhos acadêmicos de forma rápida e organizada.
          </p>

          {/* Stats */}
          <div className="flex gap-6 pt-2">
            {[
              { label: "TCCs disponíveis", value: "100+" },
              { label: "Cursos", value: "2" },
              { label: "Alunos", value: "500+" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xl font-extrabold text-white">{value}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé esquerdo */}
        <div className="relative z-10">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2026 TCC Digital · CEEP
          </p>
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: "#060e1f" }}>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(96,165,250,0.3)" }}>
              <BookOpen style={{ height: 18, width: 18, color: "#60a5fa" }} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">TCC Digital</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>CEEP</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-white">Bem-vindo de volta</h2>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              Entre com sua conta para acessar o acervo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.4)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,0.4)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
              style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)", boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Entrando...
                </span>
              ) : "Entrar"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-3 text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            <p>
              Não tem conta?{" "}
              <Link to="/cadastro" className="font-semibold hover:underline" style={{ color: "#60a5fa" }}>
                Cadastre-se
              </Link>
            </p>
            <p>
              Quer acesso como administrador?{" "}
              <Link to="/solicitar" className="font-semibold hover:underline" style={{ color: "#60a5fa" }}>
                Solicitar acesso
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;