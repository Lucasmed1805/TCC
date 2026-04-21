import { Link } from "react-router-dom";
import { Search, BookOpen, Download, Eye, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import TCCCarousel from "@/components/TCCCarousel";
import TCCCard from "@/components/TCCCard";
import type { TCC } from "@/types/tcc";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const cursos = [
  "Informática",
  "Redes de Computadores",
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"all" | "tcc" | "apostila">("all");
  const [cursoFiltro, setCursoFiltro] = useState("");
  const [tccs, setTccs] = useState<TCC[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

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

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg,#060e1f 0%,#0a1628 40%,#0d2550 75%,#071020 100%)", minHeight: "85vmin" }}>

        {/* Grid de pontos */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* Glow azul */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(37,99,235,0.18) 0%,transparent 70%)" }} />

        {/* Glow laranja */}
        <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(245,166,35,0.08) 0%,transparent 70%)" }} />

        <div className="container mx-auto px-5 pt-14 pb-10 relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5 text-xs font-semibold"
            style={{ background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)", color: "#f5a623" }}>
            <Sparkles style={{ height: 11, width: 11 }} />
            Biblioteca Digital CEEP
          </div>

          <h1 className="text-white font-extrabold leading-[1.15] mb-4 tracking-tight"
            style={{ fontSize: "clamp(1.7rem,7vw,3rem)" }}>
            Seu Repositório<br />
            <span style={{ color: "#f5a623" }}>Digital de TCCs</span><br />
            e Apostilas
          </h1>

          <p className="mb-8 max-w-xs mx-auto text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Acesse, guarde e compartilhe trabalhos acadêmicos de forma rápida e organizada.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-xs sm:max-w-none">
            {isAdmin && (
              <Link to="/tccs" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto font-bold text-white text-sm px-7 py-3.5 rounded-xl transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg,#e85d04,#f97316)", boxShadow: "0 4px 20px rgba(232,93,4,0.35)" }}>
                  ✉ Enviar meu trabalho
                </button>
              </Link>
            )}
            <Link to="/tccs" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto font-semibold text-white text-sm px-7 py-3.5 rounded-xl border transition-all active:scale-95"
                style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.2)" }}>
                🔍 Buscar arquivos
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div style={{ background: "#0a1628", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container mx-auto px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(({ label, value, Icon, color }) => (
            <div key={label} className="flex items-center gap-3 px-3 py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}18` }}>
                <Icon style={{ height: 17, width: 17, color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-white leading-none">{value}</p>
                <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="container mx-auto px-5 py-5">
        <div className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Campo de texto */}
          <div className="flex items-center gap-2.5 rounded-xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Search className="h-4 w-4 shrink-0" style={{ color: "rgba(255,255,255,0.35)" }} />
            <input type="text" placeholder="Pesquisar TCCs, Apostilas ou Temas..."
              className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          {/* Filtros em linha */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/40 font-medium shrink-0">Tipo:</span>
            {(["all", "tcc", "apostila"] as const).map((tipo) => (
              <button key={tipo} onClick={() => setTipoFiltro(tipo)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                style={tipoFiltro === tipo
                  ? { background: "#1a4fa0", color: "white", border: "1px solid #2563eb" }
                  : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {tipo === "all" ? "Todos" : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </button>
            ))}
          </div>

          {/* Área + Buscar */}
          <div className="flex gap-2">
            <select value={cursoFiltro} onChange={(e) => setCursoFiltro(e.target.value)}
              className="flex-1 text-sm rounded-xl px-3 py-3 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: cursoFiltro ? "white" : "rgba(255,255,255,0.35)" }}>
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
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="inline-block w-1 h-5 rounded-full" style={{ background: "#f5a623" }} />
            Destaques Recentes
          </h2>
          <Link to="/tccs" className="text-xs font-semibold" style={{ color: "#3b82f6" }}>
            Ver todos →
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-white/40">Carregando...</p>
        ) : destaques.length === 0 ? (
          <p className="text-sm text-white/40">Nenhum TCC cadastrado ainda.</p>
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
          return (
            <TCCCarousel key={curso} title={curso}
              subtitle={`${tccsDoCurso.length} trabalhos disponíveis`} tccs={tccsDoCurso} />
          );
        })}
      </section>

      {/* ── Cursos CTA ── */}
      <section className="py-12" style={{ background: "#0a1628", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container mx-auto px-5">
          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-white mb-1">Cursos Disponíveis</h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Explore TCCs organizados por área</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {cursos.map((curso, i) => (
              <Link key={curso} to={`/tccs?curso=${encodeURIComponent(curso)}`}
                className="group flex items-center gap-4 rounded-2xl p-4 transition-all active:scale-[0.98]"
                style={{
                  background: i === 0
                    ? "linear-gradient(135deg,rgba(26,79,160,0.3),rgba(37,99,235,0.15))"
                    : "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(109,40,217,0.1))",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}>
                <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: i === 0 ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.2)" }}>
                  <BookOpen style={{ height: 20, width: 20, color: i === 0 ? "#60a5fa" : "#a78bfa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{curso}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {tccs.filter((t) => t.curso === curso).length} trabalhos
                  </p>
                </div>
                <ArrowRight style={{ height: 16, width: 16, color: "rgba(255,255,255,0.3)" }}
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