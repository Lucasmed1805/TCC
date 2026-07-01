import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Monitor, Wifi, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cursos } from "@/pages/Index";
import { useTheme } from "@/hooks/ThemeContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

const cursoConfigDark: Record<string, { Icon: any; gradient: string; iconBg: string; iconColor: string }> = {
  "Informática": {
    Icon: Monitor,
    gradient: "linear-gradient(135deg,rgba(37,99,235,0.25),rgba(26,79,160,0.1))",
    iconBg: "rgba(59,130,246,0.15)",
    iconColor: "#60a5fa",
  },
  "Redes de Computadores": {
    Icon: Wifi,
    gradient: "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(109,40,217,0.1))",
    iconBg: "rgba(139,92,246,0.15)",
    iconColor: "#a78bfa",
  },
};

const cursoConfigLight: Record<string, { Icon: any; gradient: string; iconBg: string; iconColor: string }> = {
  "Informática": {
    Icon: Monitor,
    gradient: "linear-gradient(135deg,rgba(37,99,235,0.12),rgba(26,79,160,0.04))",
    iconBg: "rgba(59,130,246,0.12)",
    iconColor: "#2563eb",
  },
  "Redes de Computadores": {
    Icon: Wifi,
    gradient: "linear-gradient(135deg,rgba(139,92,246,0.12),rgba(109,40,217,0.04))",
    iconBg: "rgba(139,92,246,0.12)",
    iconColor: "#7c3aed",
  },
};

const Categorias = () => {
  const [tccs, setTccs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const { isDark } = useTheme();

  // ── theme tokens ──
  const pageBg = isDark ? "#060e1f" : "#f0f4f8";
  const heroBg = isDark
    ? "linear-gradient(160deg,#0a1628,#0d2550 60%,#060e1f)"
    : "linear-gradient(160deg,#dce8f8,#c8dcf0 60%,#dce8f8)";
  const textMain = isDark ? "#ffffff" : "#0d1b2a";
  const textMuted = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)";
  const textFaint = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const statBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const statBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const cardBg = isDark ? "#111f38" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const dividerBorder = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const progressTrack = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const arrowIconBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const arrowIconColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)";
  const cursoConfig = isDark ? cursoConfigDark : cursoConfigLight;

  useEffect(() => {
    fetch(`${API}/api/tccs`)
      .then((r) => r.json())
      .then((data) => { setTccs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cursosFiltrados = cursos.filter((c) =>
    c.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen transition-colors" style={{ background: pageBg }}>

      {/* Hero da página */}
      <div className="px-5 pt-8 pb-6" style={{ background: heroBg }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#f5a623" }}>
            Explorar
          </p>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: textMain }}>Categorias</h1>
          <p className="text-sm" style={{ color: textMuted }}>
            Explore TCCs organizados por curso
          </p>
        </motion.div>

        {/* Busca */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="mt-4 flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{ background: inputBg, border: `1px solid ${inputBorder}` }}>
          <Search style={{ height: 16, width: 16, color: textFaint, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-transparent text-sm outline-none w-full"
            style={{ color: textMain }}
          />
        </motion.div>
      </div>

      {/* Cards */}
      <div className="px-5 pb-10 space-y-4 max-w-xl mx-auto">

        {/* Stat geral */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: statBg, border: `1px solid ${statBorder}` }}>
          <span className="text-sm" style={{ color: textMuted }}>Total de trabalhos</span>
          <span className="text-sm font-bold" style={{ color: textMain }}>{loading ? "..." : tccs.length}</span>
        </motion.div>

        {/* Lista de cursos */}
        {cursosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-sm" style={{ color: textFaint }}>Nenhuma categoria encontrada.</div>
        ) : cursosFiltrados.map((curso, i) => {
          const config = cursoConfig[curso] || {
            Icon: BookOpen,
            gradient: isDark
              ? "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.1))"
              : "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,150,105,0.03))",
            iconBg: isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.12)",
            iconColor: isDark ? "#34d399" : "#059669",
          };
          const { Icon, gradient, iconBg, iconColor } = config;
          const count = tccs.filter((t) => t.curso === curso).length;
          const percent = tccs.length > 0 ? Math.round((count / tccs.length) * 100) : 0;

          return (
            <motion.div
              key={curso}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}>
              <Link to={`/tccs?curso=${encodeURIComponent(curso)}`}
                className="block rounded-2xl overflow-hidden transition-all active:scale-[0.98]"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>

                {/* Topo colorido */}
                <div className="px-5 pt-5 pb-4" style={{ background: gradient }}>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: iconBg }}>
                      <Icon style={{ height: 26, width: 26, color: iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold leading-tight" style={{ color: textMain }}>{curso}</h2>
                      <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                        {loading ? "..." : `${count} trabalho${count !== 1 ? "s" : ""} disponíve${count !== 1 ? "is" : "l"}`}
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: arrowIconBg }}>
                      <ArrowRight style={{ height: 15, width: 15, color: arrowIconColor }} />
                    </div>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="px-5 py-3" style={{ borderTop: `1px solid ${dividerBorder}` }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: textFaint }}>Participação no acervo</span>
                    <span className="text-[10px] font-bold" style={{ color: iconColor }}>{percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full w-full" style={{ background: progressTrack }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: iconColor }} />
                  </div>
                </div>

                {/* Rodapé */}
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: `1px solid ${dividerBorder}` }}>
                  <span className="text-xs font-semibold" style={{ color: iconColor }}>
                    Ver todos os trabalhos
                  </span>
                  <ArrowRight style={{ height: 14, width: 14, color: iconColor }} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Categorias;
