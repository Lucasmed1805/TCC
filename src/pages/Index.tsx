import { Link } from "react-router-dom";
import { Search, BookOpen, Download, Eye, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";
import TCCCarousel from "@/components/TCCCarousel";
import TCCCard from "@/components/TCCCard";
import type { TCC } from "@/types/tcc";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const cursos = ["Informática", "Redes de Computadores"];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"all" | "tcc" | "apostila">("all");
  const [cursoFiltro, setCursoFiltro] = useState("");
  const [tccs, setTccs] = useState<TCC[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    fetch(`${API}/tccs`)
      .then((res) => res.json())
      .then((data) => { setTccs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const recentTccs = [...tccs].sort((a, b) => b.criado_em.localeCompare(a.criado_em));
  const destaques = recentTccs.slice(0, 4);

  const stats = [
    { label: "TCCs Cadastrados", value: tccs.length, Icon: BookOpen, color: "#3b82f6" },
    { label: "Downloads", value: tccs.reduce((a, t) => a + (t.downloads || 0), 0), Icon: Download, color: "#f5a623" },
    { label: "Visualizações", value: tccs.reduce((a, t) => a + (t.visualizacoes || 0), 0), Icon: Eye, color: "#10b981" },
    { label: "Cursos", value: cursos.length, Icon: BarChart3, color: "#8b5cf6" },
  ];

  // ── theme tokens ──
  const pageBg     = isDark ? "#060e1f" : "#f0f4f8";
  const heroBg     = isDark
    ? "linear-gradient(160deg,#060e1f 0%,#0a1628 40%,#0d2550 75%,#071020 100%)"
    : "linear-gradient(160deg,#dce8f8 0%,#c8dcf0 40%,#b8d0ec 75%,#d0e4f4 100%)";
  const statsBg    = isDark ? "#0a1628" : "#e2eaf2";
  const statsBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const statCard   = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const statCardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const cardBg     = isDark ? "#111f38" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textMain   = isDark ? "#ffffff" : "#0d1b2a";
  const textMuted  = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)";
  const inputBg    = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)";
  const badgeBg    = isDark ? "rgba(245,166,35,0.12)" : "rgba(245,166,35,0.15)";
  const sectionBg  = isDark ? "#0a1628" : "#e2eaf2";
  const dotGrid    = isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.04)";

  return (
    <div className="min-h-screen transition-colors" style={{ background: pageBg }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: heroBg, minHeight: "85vmin" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle,currentColor 1px,transparent 1px)", backgroundSize: "24px 24px", color: dotGrid, opacity: 1 }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(37,99,235,0.18) 0%,transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(245,166,35,0.08) 0%,transparent 70%)" }} />

        <div className="container mx-auto px-5 pt-14 pb-10 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5 text-xs font-semibold"
            style={{ background: badgeBg, border: "1px solid rgba(245,166,35,0.3)", color: "#f5a623" }}>
            <Sparkles style={{ height: 11, width: 11 }} />
            Biblioteca Digital CEEP
          </div>

          <h1 className="font-extrabold leading-[1.15] mb-4 tracking-tight"
            style={{ fontSize: "clamp(1.7rem,7vw,3rem)", color: textMain }}>
            Seu Repositório<br />
            <span style={{ color: "#f5a623" }}>Digital de TCCs</span><br />
            e Apostilas
          </h1>

          <p className="mb-8 max-w-xs mx-auto text-sm leading-relaxed" style={{ color: textMuted }}>
            Acesse, guarde e compartilhe trabalhos acadêmicos de forma rápida e organizada.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-xs sm:max-w-none">
            {isAdmin && (
              <Link to="/tccs" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto font-bold text-white text-sm px-7 py-3.5 rounded-xl transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg,#e85d04,#f97316)", boxShadow: "0 4px 20px rgba(232,93,4,0.35)" }}>
                  ✉ Enviar TCC
                </button>
              </Link>
            )}
            <Link to="/tccs" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto font-semibold text-sm px-7 py-3.5 rounded-xl border transition-all active:scale-95"
                style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)", borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)", color: textMain }}>
                🔍 Buscar arquivos
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div style={{ background: statsBg, borderBottom: `1px solid ${statsBorder}` }}>
        <div className="container mx-auto px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(({ label, value, Icon, color }) => (
            <div key={label} className="flex items-center gap-3 px-3 py-3 rounded-xl"
              style={{ background: statCard, border: `1px solid ${statCardBorder}` }}>
              <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                <Icon style={{ height: 17, width: 17, color }} />
              </div>
              <div>
                <p className="text-lg font-bold leading-none" style={{ color: textMain }}>{value}</p>
                <p className="text-[10px] mt-0.5 leading-tight" style={{ color: textMuted }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="container mx-auto px-5 py-5">
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3" style={{ background: inputBg, border: `1px solid ${inputBorder}` }}>
            <Search className="h-4 w-4 shrink-0" style={{ color: textMuted }} />
            <input type="text" placeholder="Pesquisar TCCs, Apostilas ou Temas..."
              className="bg-transparent text-sm outline-none w-full"
              style={{ color: textMain }}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium shrink-0" style={{ color: textMuted }}>Tipo:</span>
            {(["all", "tcc", "apostila"] as const).map((tipo) => (
              <button key={tipo} onClick={() => setTipoFiltro(tipo)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={tipoFiltro === tipo
                  ? { background: "#1a4fa0", color: "white", border: "1px solid #2563eb" }
                  : { background: inputBg, color: textMuted, border: `1px solid ${inputBorder}` }}>
                {tipo === "all" ? "Todos" : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <select value={cursoFiltro} onChange={(e) => setCursoFiltro(e.target.value)}
              className="flex-1 text-sm rounded-xl px-3 py-3 outline-none"
              style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: cursoFiltro ? textMain : textMuted }}>
              <option value="">Área do Conhecimento</option>
              {cursos.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button className="text-white text-sm font-bold px-5 py-3 rounded-xl transition-all active:scale-95 whitespace-nowrap"
              style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}>
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* ── Destaques Recentes ── */}
      <section className="container mx-auto px-5 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold flex items-center gap-2" style={{ color: textMain }}>
            <span className="inline-block w-1 h-5 rounded-full" style={{ background: "#f5a623" }} />
            Destaques Recentes
          </h2>
          <Link to="/tccs" className="text-xs font-semibold" style={{ color: "#3b82f6" }}>Ver todos →</Link>
        </div>
        {loading ? (
          <p className="text-sm" style={{ color: textMuted }}>Carregando...</p>
        ) : destaques.length === 0 ? (
          <p className="text-sm" style={{ color: textMuted }}>Nenhum TCC cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {destaques.map((tcc) => <TCCCard key={tcc.id} tcc={tcc} />)}
          </div>
        )}
      </section>

      {/* ── Carousels ── */}
      <section className="container mx-auto px-5 pb-10 space-y-10">
        <TCCCarousel title="Mais Recentes" subtitle="Últimos trabalhos cadastrados" tccs={recentTccs} />
        {cursos.map((curso) => {
          const tccsDoCurso = tccs.filter((t) => t.curso === curso);
          if (tccsDoCurso.length === 0) return null;
          return <TCCCarousel key={curso} title={curso} subtitle={`${tccsDoCurso.length} trabalhos disponíveis`} tccs={tccsDoCurso} />;
        })}
      </section>

      {/* ── Cursos CTA ── */}
      <section className="py-12" style={{ background: sectionBg, borderTop: `1px solid ${statsBorder}` }}>
        <div className="container mx-auto px-5">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold mb-1" style={{ color: textMain }}>Cursos Disponíveis</h2>
            <p className="text-sm" style={{ color: textMuted }}>Explore TCCs organizados por área</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {cursos.map((curso, i) => (
              <Link key={curso} to={`/tccs?curso=${encodeURIComponent(curso)}`}
                className="group flex items-center gap-4 rounded-2xl p-4 transition-all active:scale-[0.98]"
                style={{
                  background: i === 0
                    ? isDark ? "linear-gradient(135deg,rgba(26,79,160,0.3),rgba(37,99,235,0.15))" : "rgba(37,99,235,0.08)"
                    : isDark ? "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(109,40,217,0.1))" : "rgba(139,92,246,0.08)",
                  border: `1px solid ${cardBorder}`
                }}>
                <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: i === 0 ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.2)" }}>
                  <BookOpen style={{ height: 20, width: 20, color: i === 0 ? "#60a5fa" : "#a78bfa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: textMain }}>{curso}</p>
                  <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                    {tccs.filter((t) => t.curso === curso).length} trabalhos
                  </p>
                </div>
                <ArrowRight style={{ height: 16, width: 16, color: textMuted }}
                  className="shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;