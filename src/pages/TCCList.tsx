import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X, BookOpen, Sparkles, Send, Loader2, ChevronRight, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TCCCard from "@/components/TCCCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const cursos = ["Informática", "Redes de Computadores"];

type Recomendado = {
  _id: string;
  titulo: string;
  autor: string;
  curso: string;
  ano: number;
};

type Mensagem =
  | { tipo: "usuario"; texto: string }
  | { tipo: "ia"; texto: string; recomendados?: Recomendado[] }
  | { tipo: "erro"; texto: string };

// ── Componente de chat IA ──
const ChatIA = () => {
  const navigate = useNavigate();
  const [ideia, setIdeia] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [carregando, setCarregando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando]);

  const enviar = async () => {
    const texto = ideia.trim();
    if (!texto || carregando) return;

    setMensagens((prev) => [...prev, { tipo: "usuario", texto }]);
    setIdeia("");
    setCarregando(true);

    try {
      const res = await fetch(`${API}/api/ia/recomendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideia: texto }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMensagens((prev) => [...prev, { tipo: "erro", texto: data.error || "Erro ao consultar a IA." }]);
      } else {
        setMensagens((prev) => [
          ...prev,
          { tipo: "ia", texto: data.texto, recomendados: data.recomendados },
        ]);
      }
    } catch {
      setMensagens((prev) => [...prev, { tipo: "erro", texto: "Não foi possível conectar ao servidor." }]);
    }

    setCarregando(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#0a1628",
        border: "1px solid rgba(96,165,250,0.15)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header do chat */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg,#0d1f3c,#0f2550)",
          borderBottom: "1px solid rgba(96,165,250,0.1)",
        }}
      >
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 relative"
          style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(96,165,250,0.2)" }}
        >
          <Sparkles style={{ height: 17, width: 17, color: "#60a5fa" }} />
          {/* dot animado */}
          <span
            className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full flex items-center justify-center"
            style={{ background: "#060e1f" }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: "#4ade80",
                boxShadow: "0 0 6px #4ade80",
                animation: "pulse-green 2s ease-in-out infinite",
              }}
            />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white">Assistente de Inspiração</p>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Descreva sua ideia · IA encontra os melhores TCCs para você
          </p>
        </div>
        {mensagens.length > 0 && (
          <button
            onClick={() => setMensagens([])}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
          >
            Limpar
          </button>
        )}
      </div>

      {/* Área de mensagens */}
      <div
        className="px-4 py-4 space-y-4 overflow-y-auto"
        style={{
          minHeight: mensagens.length === 0 ? "0px" : "280px",
          maxHeight: "380px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(96,165,250,0.12) transparent",
        }}
      >
        {/* Estado inicial — sugestões */}
        {mensagens.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
              Exemplos de ideias
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Quero fazer um TCC sobre segurança de redes e proteção de dados",
                "Tenho interesse em desenvolvimento de aplicativos mobile",
                "Quero pesquisar sobre inteligência artificial e automação",
              ].map((sugestao) => (
                <button
                  key={sugestao}
                  onClick={() => { setIdeia(sugestao); inputRef.current?.focus(); }}
                  className="w-full text-left px-3.5 py-3 rounded-xl text-xs transition-all flex items-center gap-2.5 group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(37,99,235,0.1)";
                    e.currentTarget.style.borderColor = "rgba(96,165,250,0.2)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  <MessageSquare style={{ height: 12, width: 12, flexShrink: 0, color: "#60a5fa" }} />
                  {sugestao}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensagens */}
        {mensagens.map((msg, i) => (
          <div key={i}>
            {msg.tipo === "usuario" && (
              <div className="flex justify-end">
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white"
                  style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}
                >
                  {msg.texto}
                </motion.div>
              </div>
            )}

            {msg.tipo === "ia" && (
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                {/* Texto da resposta */}
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.82)",
                    lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.texto}
                </div>

                {/* Cards dos TCCs recomendados */}
                {msg.recomendados && msg.recomendados.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider px-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                      Abrir no acervo
                    </p>
                    {msg.recomendados.map((tcc, idx) => (
                      <motion.button
                        key={tcc._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        onClick={() => navigate(`/tcc/${tcc._id}`)}
                        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all"
                        style={{
                          background: "rgba(37,99,235,0.08)",
                          border: "1px solid rgba(96,165,250,0.12)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(37,99,235,0.18)";
                          e.currentTarget.style.borderColor = "rgba(96,165,250,0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(37,99,235,0.08)";
                          e.currentTarget.style.borderColor = "rgba(96,165,250,0.12)";
                        }}
                      >
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(37,99,235,0.2)" }}
                        >
                          <BookOpen style={{ height: 13, width: 13, color: "#60a5fa" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{tcc.titulo}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {tcc.autor} · {tcc.curso} · {tcc.ano}
                          </p>
                        </div>
                        <ChevronRight style={{ height: 13, width: 13, color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {msg.tipo === "erro" && (
              <div
                className="px-4 py-3 rounded-2xl text-sm"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
              >
                ⚠️ {msg.texto}
              </div>
            )}
          </div>
        ))}

        {/* Loading */}
        {carregando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-tl-sm w-fit"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Loader2 style={{ height: 13, width: 13, color: "#60a5fa", animation: "spin 1s linear infinite" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Analisando o acervo...</span>
            <span className="flex gap-1">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#60a5fa",
                    opacity: 0.4,
                    animation: `bounce-dot 1.2s ease-in-out ${d * 0.2}s infinite`,
                  }}
                />
              ))}
            </span>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}
      >
        <div
          className="flex items-end gap-2 rounded-xl px-3.5 py-2.5 transition-all"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <Sparkles style={{ height: 14, width: 14, color: "rgba(96,165,250,0.5)", flexShrink: 0, marginBottom: "3px" }} />
          <textarea
            ref={inputRef}
            value={ideia}
            onChange={(e) => setIdeia(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva a ideia do seu TCC para encontrar inspirações..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-white outline-none resize-none placeholder:text-white/25"
            style={{ maxHeight: "100px", lineHeight: 1.6, paddingTop: "2px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 100) + "px";
            }}
          />
          <button
            onClick={enviar}
            disabled={!ideia.trim() || carregando}
            className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-30"
            style={{
              background: ideia.trim() && !carregando
                ? "linear-gradient(135deg,#1a4fa0,#2563eb)"
                : "rgba(255,255,255,0.07)",
            }}
          >
            <Send style={{ height: 13, width: 13, color: "white" }} />
          </button>
        </div>
        <p className="text-[9px] text-center mt-1.5" style={{ color: "rgba(255,255,255,0.18)" }}>
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </motion.div>
  );
};

// ── Página principal ──
const TCCList = () => {
  const [searchParams] = useSearchParams();
  const [tccs, setTccs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cursoFilter, setCursoFilter] = useState(searchParams.get("curso") || "");
  const [anoFilter, setAnoFilter] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  useEffect(() => {
    fetch(`${API}/tccs`)
      .then((r) => r.json())
      .then((data) => { setTccs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const anos = [...new Set(tccs.map((t) => t.ano))].sort((a, b) => b - a);

  const filtered = tccs.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.titulo?.toLowerCase().includes(q) || t.autor?.toLowerCase().includes(q);
    const matchCurso = !cursoFilter || t.curso === cursoFilter;
    const matchAno = !anoFilter || t.ano === Number(anoFilter);
    return matchSearch && matchCurso && matchAno;
  });

  const temFiltros = cursoFilter || anoFilter;

  const limparFiltros = () => {
    setCursoFilter("");
    setAnoFilter("");
    setSearch("");
  };

  return (
    <div className="min-h-screen" style={{ background: "#060e1f" }}>

      {/* Hero */}
      <div className="px-5 pt-8 pb-5"
        style={{ background: "linear-gradient(160deg,#0a1628,#0d2550 60%,#060e1f)" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#f5a623" }}>Acervo</p>
          <h1 className="text-2xl font-extrabold text-white mb-1">TCCs e Apostilas</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            {loading ? "Carregando..." : `${tccs.length} trabalho${tccs.length !== 1 ? "s" : ""} disponíve${tccs.length !== 1 ? "is" : "l"}`}
          </p>
        </motion.div>

        {/* Barra de busca */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="mt-4 flex gap-2">
          <div className="flex-1 flex items-center gap-2.5 rounded-xl px-4 py-3"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Search style={{ height: 15, width: 15, color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-white/30 hover:text-white/60">
                <X style={{ height: 14, width: 14 }} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltrosAbertos(!filtrosAbertos)}
            className="px-3.5 rounded-xl flex items-center gap-1.5 text-sm font-semibold transition-all"
            style={filtrosAbertos || temFiltros
              ? { background: "#1a4fa0", color: "white", border: "1px solid #2563eb" }
              : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <SlidersHorizontal style={{ height: 15, width: 15 }} />
            {temFiltros ? "•" : ""}
          </button>
        </motion.div>

        {/* Filtros expandíveis */}
        <AnimatePresence>
          {filtrosAbertos && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden">
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap">
                  {cursos.map((c) => (
                    <button key={c} onClick={() => setCursoFilter(cursoFilter === c ? "" : c)}
                      className="text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                      style={cursoFilter === c
                        ? { background: "#1a4fa0", color: "white", border: "1px solid #2563eb" }
                        : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {c}
                    </button>
                  ))}
                </div>
                {anos.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {anos.map((a) => (
                      <button key={a} onClick={() => setAnoFilter(anoFilter === String(a) ? "" : String(a))}
                        className="text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                        style={anoFilter === String(a)
                          ? { background: "#f5a623", color: "#0a1628", border: "1px solid #f5a623" }
                          : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {a}
                      </button>
                    ))}
                  </div>
                )}
                {temFiltros && (
                  <button onClick={limparFiltros} className="self-start text-xs text-red-400 flex items-center gap-1 mt-1">
                    <X style={{ height: 11, width: 11 }} /> Limpar filtros
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conteúdo */}
      <div className="px-5 pb-10 max-w-5xl mx-auto">

        {/* ── Chat IA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 mb-8"
        >
          <ChatIA />
        </motion.div>

        {/* ── Divisor ── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
            Acervo completo
          </p>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* ── Lista de TCCs ── */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#1a4fa0", borderTopColor: "transparent" }} />
            <p className="text-sm text-white/40">Carregando trabalhos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-2"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <BookOpen style={{ height: 28, width: 28, color: "rgba(255,255,255,0.15)" }} />
            </div>
            <p className="text-base font-semibold text-white">Nenhum trabalho encontrado</p>
            <p className="text-sm text-white/40">Tente ajustar os filtros de busca</p>
            {temFiltros && (
              <button onClick={limparFiltros}
                className="mt-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
                style={{ background: "rgba(26,79,160,0.3)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
                Limpar filtros
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <p className="text-xs text-white/30 mb-4">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
              {temFiltros ? " com filtros aplicados" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((tcc, i) => (
                <motion.div key={tcc._id || tcc.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}>
                  <TCCCard tcc={tcc} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TCCList;