import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Monitor, Wifi, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cursos } from "@/pages/Index";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

const cursoConfig: Record<string, { Icon: any; gradient: string; iconBg: string; iconColor: string }> = {
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

const Categorias = () => {
  const [tccs, setTccs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetch(`${API}/tccs`)
      .then((r) => r.json())
      .then((data) => { setTccs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cursosFiltrados = cursos.filter((c) =>
    c.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#060e1f" }}>

      {/* Hero da página */}
      <div className="px-5 pt-8 pb-6"
        style={{ background: "linear-gradient(160deg,#0a1628,#0d2550 60%,#060e1f)" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#f5a623" }}>
            Explorar
          </p>
          <h1 className="text-2xl font-extrabold text-white mb-1">Categorias</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Explore TCCs organizados por curso
          </p>
        </motion.div>

        {/* Busca */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="mt-4 flex items-center gap-2.5 rounded-xl px-4 py-3"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Search style={{ height: 16, width: 16, color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
          />
        </motion.div>
      </div>

      {/* Cards */}
      <div className="px-5 pb-10 space-y-4 max-w-xl mx-auto">

        {/* Stat geral */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <span className="text-sm text-white/50">Total de trabalhos</span>
          <span className="text-sm font-bold text-white">{loading ? "..." : tccs.length}</span>
        </motion.div>

        {/* Lista de cursos */}
        {cursosFiltrados.length === 0 ? (
          <div className="text-center py-16 text-white/30 text-sm">Nenhuma categoria encontrada.</div>
        ) : cursosFiltrados.map((curso, i) => {
          const config = cursoConfig[curso] || {
            Icon: BookOpen,
            gradient: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.1))",
            iconBg: "rgba(16,185,129,0.15)",
            iconColor: "#34d399",
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
                style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}>

                {/* Topo colorido */}
                <div className="px-5 pt-5 pb-4" style={{ background: gradient }}>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: iconBg }}>
                      <Icon style={{ height: 26, width: 26, color: iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-white leading-tight">{curso}</h2>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {loading ? "..." : `${count} trabalho${count !== 1 ? "s" : ""} disponíve${count !== 1 ? "is" : "l"}`}
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "rgba(255,255,255,0.08)" }}>
                      <ArrowRight style={{ height: 15, width: 15, color: "rgba(255,255,255,0.5)" }} />
                    </div>
                  </div>
                </div>

                {/* Barra de progresso */}
                <div className="px-5 py-3 border-t border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">Participação no acervo</span>
                    <span className="text-[10px] font-bold" style={{ color: iconColor }}>{percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: iconColor }} />
                  </div>
                </div>

                {/* Rodapé */}
                <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
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