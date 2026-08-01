import { Link } from "react-router-dom";
import {
  Search, BookOpen, Download, Eye, ArrowRight, Sparkles,
  Monitor, Network, FileText, GraduationCap,
  UploadCloud, ClipboardCheck, ShieldCheck, Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useTheme } from "@/hooks/ThemeContext";
import TCCCarousel from "@/components/TCCCarousel";
import TCCCard from "@/components/TCCCard";
import type { TCC } from "@/types/tcc";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const cursos = ["Informática", "Redes de Computadores"];

const categoryTiles = [
  { label: "Informática",           icon: Monitor,        color: "#1d4ed8", filterKey: "curso", filterVal: "Informática" },
  { label: "Redes de Computadores", icon: Network,        color: "#ef4444", filterKey: "curso", filterVal: "Redes de Computadores" },
  { label: "TCCs",                  icon: GraduationCap,  color: "#1d4ed8", filterKey: "tipo",  filterVal: "tcc" },
  { label: "Apostilas",             icon: FileText,       color: "#ef4444", filterKey: "tipo",  filterVal: "apostila" },
];

const steps = [
  { n: 1, title: "Envie seu trabalho", desc: "Envie seu TCC ou apostila para nossa biblioteca.", Icon: UploadCloud, color: "#1d4ed8" },
  { n: 2, title: "Análise e revisão",  desc: "Nossa equipe realiza a análise do material.",       Icon: Search,      color: "#ef4444" },
  { n: 3, title: "Aprovação",          desc: "Após aprovado, o trabalho é publicado.",             Icon: ShieldCheck, color: "#10b981" },
  { n: 4, title: "Disponível",         desc: "Seu trabalho fica disponível para todos.",           Icon: Globe,       color: "#8b5cf6" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
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
    { label: "TCCs Publicados", value: tccs.length, Icon: BookOpen, color: "#1d4ed8" },
    { label: "Downloads",       value: tccs.reduce((a, t) => a + (t.downloads || 0), 0), Icon: Download, color: "#ef4444" },
    { label: "Visualizações",   value: tccs.reduce((a, t) => a + (t.visualizacoes || 0), 0), Icon: Eye, color: "#10b981" },
    { label: "Cursos",          value: cursos.length, Icon: GraduationCap, color: "#8b5cf6" },
  ];

  // ── theme tokens ──
  const pageBg      = isDark ? "#0b1220" : "#ffffff";
  const heroBg       = isDark
    ? "linear-gradient(160deg,#0b1220 0%,#0f1a30 40%,#132a52 75%,#0b1220 100%)"
    : "linear-gradient(160deg,#ffffff 0%,#f4f8ff 40%,#eef4ff 75%,#ffffff 100%)";
  const cardBg        = isDark ? "#111f38" : "#ffffff";
  const cardBorder    = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const textMain      = isDark ? "#ffffff" : "#0f172a";
  const textMuted     = isDark ? "rgba(255,255,255,0.55)" : "rgba(15,23,42,0.68)";
  const inputBg       = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.04)";
  const inputBorder   = isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.1)";
  const badgeBg       = isDark ? "rgba(29,78,216,0.15)" : "rgba(29,78,216,0.08)";
  const sectionBg     = isDark ? "#0f1a30" : "#f8fafc";
  const sectionBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const dotGrid       = isDark ? "rgba(255,255,255,0.035)" : "rgba(15,23,42,0.035)";
  const dividerLine   = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";

  const irParaFiltro = (key: string, val: string) => `/tccs?${key}=${encodeURIComponent(val)}`;

  return (
    <div className="min-h-screen transition-colors" style={{ background: pageBg }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: heroBg }}>
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle,currentColor 1px,transparent 1px)", backgroundSize: "24px 24px", color: dotGrid }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(29,78,216,0.14) 0%,transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(239,68,68,0.08) 0%,transparent 70%)" }} />

        <div className="container mx-auto px-5 pt-14 pb-16 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5 text-xs font-semibold"
            style={{ background: badgeBg, border: "1px solid rgba(29,78,216,0.3)", color: "#1d4ed8" }}>
            <Sparkles style={{ height: 11, width: 11 }} />
            Biblioteca Digital CEEP
          </div>

          <h1 className="font-extrabold leading-[1.15] mb-4 tracking-tight"
            style={{ fontSize: "clamp(1.9rem,6vw,3.2rem)", color: textMain }}>
            Seu Repositório<br />
            <span style={{ color: "#1d4ed8" }}>Digital de TCCs</span><br />
            <span style={{ color: "#ef4444" }}>e Apostilas</span>
          </h1>

          <p className="mb-8 max-w-md mx-auto text-sm leading-relaxed" style={{ color: textMuted }}>
            Acesse, guarde e compartilhe trabalhos acadêmicos de forma rápida e organizada.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full max-w-xs sm:max-w-none">
            {isAdmin && (
              <Link to="/tccs" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto font-bold text-white text-sm px-7 py-3.5 rounded-xl transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg,#ef4444,#f87171)", boxShadow: "0 4px 20px rgba(239,68,68,0.3)" }}>
                  ✉ Enviar TCC
                </button>
              </Link>
            )}
            <Link to="/tccs" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto font-semibold text-sm px-7 py-3.5 rounded-xl border transition-all active:scale-95"
                style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.04)", borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.15)", color: textMain }}>
                🔍 Buscar arquivos
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Card "Encontre o que você precisa" (sobrepõe o hero) ── */}
      <div className="container mx-auto px-5 -mt-8 relative z-20">
        <div className="rounded-2xl p-5 md:p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: "0 20px 50px rgba(15,23,42,0.12)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold" style={{ color: textMain }}>Encontre o que você precisa</h2>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>Pesquise entre trabalhos, apostilas e conteúdos.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2.5">
            <div className="flex-1 flex items-center gap-2.5 rounded-xl px-4 py-3" style={{ background: inputBg, border: `1px solid ${inputBorder}` }}>
              <Search className="h-4 w-4 shrink-0" style={{ color: textMuted }} />
              <input type="text" placeholder="Digite o título, autor ou palavra-chave..."
                className="bg-transparent text-sm outline-none w-full"
                style={{ color: textMain }}
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <select value={cursoFiltro} onChange={(e) => setCursoFiltro(e.target.value)}
              className="text-sm rounded-xl px-3 py-3 outline-none md:w-48"
              style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: cursoFiltro ? textMain : textMuted }}>
              <option value="">Todos os cursos</option>
              {cursos.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}
              className="text-sm rounded-xl px-3 py-3 outline-none md:w-40"
              style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: tipoFiltro ? textMain : textMuted }}>
              <option value="">Todos os tipos</option>
              <option value="tcc">TCC</option>
              <option value="apostila">Apostila</option>
            </select>

            <Link
              to={`/tccs?${searchQuery ? `busca=${encodeURIComponent(searchQuery)}&` : ""}${cursoFiltro ? `curso=${encodeURIComponent(cursoFiltro)}&` : ""}${tipoFiltro ? `tipo=${tipoFiltro}` : ""}`}
              className="md:w-auto">
              <button className="w-full md:w-auto text-white text-sm font-bold px-6 py-3 rounded-xl transition-all active:scale-95 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)" }}>
                Pesquisar
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="container mx-auto px-5 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(({ label, value, Icon, color }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-4 rounded-2xl"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                <Icon style={{ height: 20, width: 20, color }} />
              </div>
              <div>
                <p className="text-xl font-bold leading-none" style={{ color: textMain }}>{value}</p>
                <p className="text-[11px] mt-1 leading-tight" style={{ color: textMuted }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Explore por categorias ── */}
      <section className="py-10" style={{ background: sectionBg, borderTop: `1px solid ${sectionBorder}`, borderBottom: `1px solid ${sectionBorder}` }}>
        <div className="container mx-auto px-5">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold" style={{ color: textMain }}>Explore por categorias</h2>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>Navegue pelos principais temas de estudo.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categoryTiles.map(({ label, icon: Icon, color, filterKey, filterVal }) => {
              const count = filterKey === "curso"
                ? tccs.filter((t) => t.curso === filterVal).length
                : tccs.filter((t) => t.tipo === filterVal).length;
              return (
                <Link key={label} to={irParaFiltro(filterKey, filterVal)}
                  className="group flex flex-col items-center text-center gap-3 rounded-2xl p-5 transition-all active:scale-[0.98]"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                    <Icon style={{ height: 22, width: 22, color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: textMain }}>{label}</p>
                    <p className="text-xs mt-1" style={{ color: textMuted }}>{count} conteúdo{count !== 1 ? "s" : ""}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TCCs em Destaque ── */}
      <section className="container mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: textMain }}>
            <span className="inline-block w-1 h-5 rounded-full" style={{ background: "#ef4444" }} />
            TCCs em Destaque
          </h2>
          <Link to="/tccs" className="text-xs font-semibold" style={{ color: "#1d4ed8" }}>Ver todos os destaques →</Link>
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

      {/* ── Carousels por curso ── */}
      <section className="container mx-auto px-5 pb-10 space-y-10">
        <TCCCarousel title="Mais Recentes" subtitle="Últimos trabalhos cadastrados" tccs={recentTccs} />
        {cursos.map((curso) => {
          const tccsDoCurso = tccs.filter((t) => t.curso === curso);
          if (tccsDoCurso.length === 0) return null;
          return <TCCCarousel key={curso} title={curso} subtitle={`${tccsDoCurso.length} trabalhos disponíveis`} tccs={tccsDoCurso} />;
        })}
      </section>

      {/* ── Como funciona ── */}
      <section className="py-14" style={{ background: sectionBg, borderTop: `1px solid ${sectionBorder}` }}>
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-lg font-bold mb-1" style={{ color: textMain }}>Como funciona?</h2>
            <p className="text-sm" style={{ color: textMuted }}>Um processo simples para compartilhar e acessar conhecimento.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-3 max-w-4xl mx-auto relative">
            {steps.map(({ n, title, desc, Icon, color }, i) => (
              <div key={n} className="flex flex-col items-center text-center gap-3 relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-full h-px" style={{ background: dividerLine, borderTop: `1px dashed ${dividerLine}` }} />
                )}
                <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm relative z-10"
                  style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
                  {n}
                </div>
                <Icon style={{ height: 18, width: 18, color }} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: textMain }}>{title}</p>
                  <p className="text-xs mt-1 max-w-[160px]" style={{ color: textMuted }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;