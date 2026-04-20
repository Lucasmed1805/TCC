import { Link } from "react-router-dom";
import { Search, BookOpen, Download, Eye, BarChart3, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import TCCCarousel from "@/components/TCCCarousel";
import TCCCard from "@/components/TCCCard";
import type { TCC } from "@/types/tcc";

const API = "http://localhost:8080";

export const cursos = [
  "Informática",
  "Redes de Computadores",
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<"all" | "tcc" | "apostila">("all");
  const [tccs, setTccs] = useState<TCC[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetch(`${API}/tccs`)
      .then((res) => res.json())
      .then((data) => {
        setTccs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const recentTccs = [...tccs].sort((a, b) =>
    b.criado_em.localeCompare(a.criado_em)
  );
  const destaques = recentTccs.slice(0, 4);

  const stats = {
    totalTccs: tccs.length,
    totalDownloads: tccs.reduce((acc, t) => acc + (t.downloads || 0), 0),
    totalVisualizacoes: tccs.reduce((acc, t) => acc + (t.visualizacoes || 0), 0),
    totalCursos: cursos.length,
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: "linear-gradient(105deg,#0a1628 0%,#0d2550 45%,#183a6e 75%,#0a1628 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at right center, rgba(59,130,246,0.12), transparent 70%)",
          }}
        />

        <div className="container mx-auto px-6 text-center relative z-10">
          <h1
            className="text-white font-extrabold leading-tight mb-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontFamily: "'Inter', sans-serif" }}
          >
            Seu Repositório Digital de<br />
            <span style={{ color: "#f5a623" }}>TCCs e Apostilas</span>
          </h1>
          <p className="mb-8 max-w-md mx-auto text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
            Acesse, guarde e compartilhe trabalhos acadêmicos de forma rápida, segura e organizada.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {isAdmin && (
              <Link to="/tccs">
                <button
                  className="font-bold text-white text-sm px-6 py-3 rounded-lg transition-colors"
                  style={{ background: "#e85d04" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#d04e00")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#e85d04")}
                >
                  ✉ ENVIAR MEU TRABALHO
                </button>
              </Link>
            )}
            <Link to="/tccs">
              <button
                className="font-semibold text-white text-sm px-6 py-3 rounded-lg border transition-colors"
                style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.28)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              >
                🔍 BUSCAR ARQUIVOS
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Search Bar ── */}
      <div className="container mx-auto px-6">
        <div className="bg-card rounded-xl shadow-lg border border-border/30 p-4 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[180px] flex items-center gap-2 bg-gray-50 border border-border/50 rounded-lg px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar TCCs, Apostilas ou Temas..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Tipo</span>
            <div className="flex gap-1">
              {(["all", "tcc", "apostila"] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoFiltro(tipo)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors"
                  style={
                    tipoFiltro === tipo
                      ? { background: "#1a4fa0", color: "white", borderColor: "#1a4fa0" }
                      : { background: "white", color: "#666", borderColor: "#dde1ea" }
                  }
                >
                  {tipo === "all" ? "All" : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <select className="text-sm text-gray-500 border border-border/50 bg-gray-50 rounded-lg px-3 py-2.5 outline-none cursor-pointer">
            <option>Área do Conhecimento</option>
            {cursos.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <button
            className="text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            style={{ background: "#1a4fa0" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#153f8a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a4fa0")}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* ── Destaques Recentes ── */}
      <section className="container mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="inline-block w-1 h-5 rounded-full" style={{ background: "#e85d04" }} />
            Destaques Recentes
          </h2>
          <Link to="/tccs" className="text-sm font-medium hover:underline" style={{ color: "#1a4fa0" }}>
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : destaques.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum TCC cadastrado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {destaques.map((tcc) => (
              <TCCCard key={tcc.id} tcc={tcc} />
            ))}
          </div>
        )}
      </section>

      {/* ── Stats Strip ── */}
      <div className="border-t border-b border-border/40 bg-card">
        <div className="container mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
          {[
            { label: "TCCs Cadastrados", value: stats.totalTccs, Icon: BookOpen },
            { label: "Downloads", value: stats.totalDownloads, Icon: Download },
            { label: "Visualizações", value: stats.totalVisualizacoes, Icon: Eye },
            { label: "Cursos", value: stats.totalCursos, Icon: BarChart3 },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="text-center px-4 py-2">
              <p className="text-2xl font-bold" style={{ color: "#1a4fa0" }}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Carousels ── */}
      <section className="container mx-auto px-6 py-10 space-y-10">
        <TCCCarousel
          title="Mais Recentes"
          subtitle="Últimos trabalhos cadastrados"
          tccs={recentTccs}
        />
        {cursos.map((curso) => {
          const tccsDoCurso = tccs.filter((t) => t.curso === curso);
          if (tccsDoCurso.length === 0) return null;
          return (
            <TCCCarousel
              key={curso}
              title={curso}
              subtitle={`${tccsDoCurso.length} trabalhos disponíveis`}
              tccs={tccsDoCurso}
            />
          );
        })}
      </section>

      {/* ── Cursos CTA ── */}
      <section className="border-t border-border/40 bg-card py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-foreground mb-1">Cursos Disponíveis</h2>
            <p className="text-sm text-muted-foreground">Explore TCCs organizados por área</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {cursos.map((curso) => (
              <Link
                key={curso}
                to={`/tccs?curso=${encodeURIComponent(curso)}`}
                className="group flex items-center gap-4 rounded-xl border p-4 transition-all"
                style={{ borderColor: "#e2e8f0", background: "#f8fafc" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#eff6ff";
                  (e.currentTarget as HTMLElement).style.borderColor = "#bfdbfe";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#f8fafc";
                  (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors"
                  style={{ background: "#dbeafe" }}
                >
                  <BookOpen className="h-5 w-5" style={{ color: "#1a4fa0" }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{curso}</p>
                  <p className="text-xs text-muted-foreground">
                    {tccs.filter((t) => t.curso === curso).length} trabalhos
                  </p>
                </div>
                <ArrowRight
                  className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1"
                  style={{ color: "#94a3b8" }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;