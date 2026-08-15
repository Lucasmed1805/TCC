import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X, BookOpen, Sparkles, Send, Loader2, ChevronRight, MessageSquare, GraduationCap, ChevronLeft, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TCCCard from "@/components/TCCCard";
import { useTheme } from "@/hooks/ThemeContext";

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
const ChatIA = ({ isDark }: { isDark: boolean }) => {
  const navigate = useNavigate();
  const [ideia, setIdeia] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [carregando, setCarregando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── theme tokens ──
  const panelBg = isDark ? "#0f1a30" : "#ffffff";
  const panelBorder = isDark ? "rgba(96,165,250,0.15)" : "rgba(29,78,216,0.15)";
  const panelShadow = isDark ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 30px rgba(15,23,42,0.08)";
  const headerBg = isDark ? "linear-gradient(135deg,#0f1a30,#132a52)" : "linear-gradient(135deg,#eaf1fc,#dbe8fa)";
  const headerBorder = isDark ? "rgba(96,165,250,0.1)" : "rgba(29,78,216,0.12)";
  const textMain = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "rgba(255,255,255,0.55)" : "rgba(15,23,42,0.68)";
  const textFainter = isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.5)";
  const textFaintest = isDark ? "rgba(255,255,255,0.25)" : "rgba(15,23,42,0.4)";
  const clearBtnBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.05)";
  const suggestionBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.025)";
  const suggestionBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.06)";
  const suggestionText = isDark ? "rgba(255,255,255,0.55)" : "rgba(15,23,42,0.6)";
  const suggestionHoverBg = isDark ? "rgba(29,78,216,0.1)" : "rgba(29,78,216,0.06)";
  const suggestionHoverBorder = isDark ? "rgba(96,165,250,0.2)" : "rgba(29,78,216,0.2)";
  const suggestionHoverText = isDark ? "rgba(255,255,255,0.8)" : "rgba(15,23,42,0.85)";
  const bubbleIaBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.03)";
  const bubbleIaBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.07)";
  const bubbleIaText = isDark ? "rgba(255,255,255,0.85)" : "rgba(15,23,42,0.82)";
  const recBg = isDark ? "rgba(29,78,216,0.08)" : "rgba(29,78,216,0.05)";
  const recBorder = isDark ? "rgba(96,165,250,0.12)" : "rgba(29,78,216,0.15)";
  const recHoverBg = isDark ? "rgba(29,78,216,0.18)" : "rgba(29,78,216,0.1)";
  const recHoverBorder = isDark ? "rgba(96,165,250,0.25)" : "rgba(29,78,216,0.3)";
  const inputAreaBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.07)";
  const inputAreaBg = isDark ? "rgba(0,0,0,0.15)" : "rgba(15,23,42,0.02)";
  const inputBoxBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)";
  const inputBoxBorder = isDark ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.1)";
  const sendIdleBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)";

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
        background: panelBg,
        border: `1px solid ${panelBorder}`,
        boxShadow: panelShadow,
      }}
    >
      {/* Header do chat */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{
          background: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
        }}
      >
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 relative"
          style={{ background: "rgba(29,78,216,0.2)", border: "1px solid rgba(96,165,250,0.2)" }}
        >
          <Sparkles style={{ height: 17, width: 17, color: "#60a5fa" }} />
          <span
            className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full flex items-center justify-center"
            style={{ background: isDark ? "#0b1220" : "#ffffff" }}
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
          <p className="text-sm font-bold" style={{ color: textMain }}>Assistente de Inspiração</p>
          <p className="text-[10px]" style={{ color: textMuted }}>
            Descreva sua ideia · IA encontra os melhores TCCs para você
          </p>
        </div>
        {mensagens.length > 0 && (
          <button
            onClick={() => setMensagens([])}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all"
            style={{ background: clearBtnBg, color: textFainter }}
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
        {mensagens.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: textFainter }}>
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
                    background: suggestionBg,
                    border: `1px solid ${suggestionBorder}`,
                    color: suggestionText,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = suggestionHoverBg;
                    e.currentTarget.style.borderColor = suggestionHoverBorder;
                    e.currentTarget.style.color = suggestionHoverText;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = suggestionBg;
                    e.currentTarget.style.borderColor = suggestionBorder;
                    e.currentTarget.style.color = suggestionText;
                  }}
                >
                  <MessageSquare style={{ height: 12, width: 12, flexShrink: 0, color: "#60a5fa" }} />
                  {sugestao}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensagens.map((msg, i) => (
          <div key={i}>
            {msg.tipo === "usuario" && (
              <div className="flex justify-end">
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white"
                  style={{ background: "linear-gradient(135deg,#1d4ed8,#2563eb)" }}
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
                <div
                  className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm"
                  style={{
                    background: bubbleIaBg,
                    border: `1px solid ${bubbleIaBorder}`,
                    color: bubbleIaText,
                    lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.texto}
                </div>

                {msg.recomendados && msg.recomendados.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider px-1" style={{ color: textFainter }}>
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
                          background: recBg,
                          border: `1px solid ${recBorder}`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = recHoverBg;
                          e.currentTarget.style.borderColor = recHoverBorder;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = recBg;
                          e.currentTarget.style.borderColor = recBorder;
                        }}
                      >
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(29,78,216,0.2)" }}
                        >
                          <BookOpen style={{ height: 13, width: 13, color: "#60a5fa" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: textMain }}>{tcc.titulo}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: textMuted }}>
                            {tcc.autor} · {tcc.curso} · {tcc.ano}
                          </p>
                        </div>
                        <ChevronRight style={{ height: 13, width: 13, color: textFainter, flexShrink: 0 }} />
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

        {carregando && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-tl-sm w-fit"
            style={{ background: bubbleIaBg, border: `1px solid ${bubbleIaBorder}` }}
          >
            <Loader2 style={{ height: 13, width: 13, color: "#60a5fa", animation: "spin 1s linear infinite" }} />
            <span className="text-xs" style={{ color: textMuted }}>Analisando o acervo...</span>
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
        style={{ borderTop: `1px solid ${inputAreaBorder}`, background: inputAreaBg }}
      >
        <div
          className="flex items-end gap-2 rounded-xl px-3.5 py-2.5 transition-all"
          style={{ background: inputBoxBg, border: `1px solid ${inputBoxBorder}` }}
        >
          <Sparkles style={{ height: 14, width: 14, color: "rgba(96,165,250,0.5)", flexShrink: 0, marginBottom: "3px" }} />
          <textarea
            ref={inputRef}
            value={ideia}
            onChange={(e) => setIdeia(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva a ideia do seu TCC para encontrar inspirações..."
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none"
            style={{ maxHeight: "100px", lineHeight: 1.6, paddingTop: "2px", color: textMain }}
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
                ? "linear-gradient(135deg,#1d4ed8,#2563eb)"
                : sendIdleBg,
            }}
          >
            <Send style={{ height: 13, width: 13, color: "white" }} />
          </button>
        </div>
        <p className="text-[9px] text-center mt-1.5" style={{ color: textFaintest }}>
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
  const [search, setSearch] = useState(searchParams.get("busca") || "");
  const [tipoFilter, setTipoFilter] = useState(searchParams.get("tipo") || "");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [aba, setAba] = useState<"acervo" | "ia">("acervo");

  // Seleção guiada: primeiro escolhe o curso, depois o ano
  const [cursoSelecionado, setCursoSelecionado] = useState<string | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState<number | null>(null);

  const { isDark } = useTheme();

  // ── theme tokens ──
  const pageBg = isDark ? "#0b1220" : "#ffffff";
  const heroBg = isDark
    ? "linear-gradient(160deg,#0f1a30,#132a52 60%,#0b1220)"
    : "linear-gradient(160deg,#ffffff,#f4f8ff 60%,#ffffff)";
  const textMain = isDark ? "#ffffff" : "#0f172a";
  const textMuted = isDark ? "rgba(255,255,255,0.55)" : "rgba(15,23,42,0.68)";
  const textFaint = isDark ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.58)";
  const textFainter = isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.5)";
  const textFaintest = isDark ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.42)";
  const inputBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.05)";
  const inputBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.12)";
  const filterIdleBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.05)";
  const filterIdleColor = isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.65)";
  const chipIdleBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.04)";
  const chipIdleColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)";
  const chipIdleBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.09)";
  const emptyIconBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.04)";
  const emptyIconColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(15,23,42,0.22)";
  const emptyBtnBg = isDark ? "rgba(29,78,216,0.3)" : "rgba(29,78,216,0.1)";
  const emptyBtnColor = isDark ? "#60a5fa" : "#1d4ed8";
  const emptyBtnBorder = isDark ? "rgba(96,165,250,0.2)" : "rgba(29,78,216,0.25)";
  const selectCardBg = isDark ? "#111f38" : "#ffffff";
  const selectCardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const selectCardHoverBorder = isDark ? "rgba(96,165,250,0.4)" : "rgba(29,78,216,0.35)";
  const breadcrumbColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.55)";

  useEffect(() => {
    fetch(`${API}/api/tccs`)
      .then((r) => r.json())
      .then((data) => { setTccs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Se o usuário buscar por texto, sai do modo "seleção guiada" e mostra resultado direto
  const emBusca = search.trim().length > 0;

  const contagemPorCurso = cursos.reduce((acc, c) => {
    acc[c] = tccs.filter((t) => t.curso === c).length;
    return acc;
  }, {} as Record<string, number>);

  const anosDoCurso = cursoSelecionado
    ? [...new Set(tccs.filter((t) => t.curso === cursoSelecionado).map((t) => t.ano))].sort((a, b) => b - a)
    : [];

  const contagemPorAno = (ano: number) =>
    tccs.filter((t) => t.curso === cursoSelecionado && t.ano === ano).length;

  const filtered = tccs.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.titulo?.toLowerCase().includes(q) || t.autor?.toLowerCase().includes(q);
    const matchTipo = !tipoFilter || t.tipo === tipoFilter;

    if (emBusca) {
      // Durante uma busca por texto, ignora a seleção guiada e pesquisa em tudo
      return matchSearch && matchTipo;
    }

    const matchCurso = !cursoSelecionado || t.curso === cursoSelecionado;
    const matchAno = !anoSelecionado || t.ano === anoSelecionado;
    return matchSearch && matchTipo && matchCurso && matchAno;
  });

  const limparSelecao = () => {
    setCursoSelecionado(null);
    setAnoSelecionado(null);
  };

  const limparFiltros = () => {
    setTipoFilter("");
    setSearch("");
    limparSelecao();
  };

  // Mostra a lista de TCCs quando: está buscando por texto, OU já escolheu curso + ano
  const mostrarLista = emBusca || (cursoSelecionado && anoSelecionado);

  return (
    <div className="min-h-screen transition-colors" style={{ background: pageBg }}>

      {/* Hero */}
      <div className="px-5 pt-8 pb-5" style={{ background: heroBg }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#1d4ed8" }}>Acervo</p>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: textMain }}>TCCs e Apostilas</h1>
          <p className="text-sm" style={{ color: textMuted }}>
            {loading ? "Carregando..." : `${tccs.length} trabalho${tccs.length !== 1 ? "s" : ""} disponíve${tccs.length !== 1 ? "is" : "l"}`}
          </p>
        </motion.div>

        {/* Seletor de abas: Acervo x Assistente IA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="mt-5 flex gap-1 p-1 rounded-xl"
          style={{ background: chipIdleBg, border: `1px solid ${chipIdleBorder}` }}
        >
          <button
            onClick={() => setAba("acervo")}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg transition-all"
            style={aba === "acervo"
              ? { background: "#1d4ed8", color: "white" }
              : { background: "transparent", color: chipIdleColor }}
          >
            <BookOpen style={{ height: 15, width: 15 }} />
            Acervo
          </button>
          <button
            onClick={() => setAba("ia")}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-lg transition-all"
            style={aba === "ia"
              ? { background: "#1d4ed8", color: "white" }
              : { background: "transparent", color: chipIdleColor }}
          >
            <Sparkles style={{ height: 15, width: 15 }} />
            Assistente IA
          </button>
        </motion.div>

        {/* Barra de busca — só aparece na aba Acervo */}
        {aba === "acervo" && (
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="mt-4 flex gap-2">
            <div className="flex-1 flex items-center gap-2.5 rounded-xl px-4 py-3"
              style={{ background: inputBg, border: `1px solid ${inputBorder}` }}>
              <Search style={{ height: 15, width: 15, color: textFaint, flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Buscar por título ou autor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none w-full"
                style={{ color: textMain }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ color: textFaint }}>
                  <X style={{ height: 14, width: 14 }} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFiltrosAbertos(!filtrosAbertos)}
              className="px-3.5 rounded-xl flex items-center gap-1.5 text-sm font-semibold transition-all"
              style={filtrosAbertos || tipoFilter
                ? { background: "#1d4ed8", color: "white", border: "1px solid #2563eb" }
                : { background: filterIdleBg, color: filterIdleColor, border: `1px solid ${inputBorder}` }}>
              <SlidersHorizontal style={{ height: 15, width: 15 }} />
              {tipoFilter ? "•" : ""}
            </button>
          </motion.div>
        )}

        {/* Filtro de Tipo — só aparece na aba Acervo */}
        <AnimatePresence>
          {aba === "acervo" && filtrosAbertos && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden">
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: textFainter }}>Tipo</p>
                <div className="flex gap-2 flex-wrap">
                  {[{ v: "tcc", label: "TCC" }, { v: "apostila", label: "Apostila" }].map(({ v, label }) => (
                    <button key={v} onClick={() => setTipoFilter(tipoFilter === v ? "" : v)}
                      className="text-xs font-semibold px-3 py-2 rounded-xl transition-all"
                      style={tipoFilter === v
                        ? { background: "#1d4ed8", color: "white", border: "1px solid #2563eb" }
                        : { background: chipIdleBg, color: chipIdleColor, border: `1px solid ${chipIdleBorder}` }}>
                      {label}
                    </button>
                  ))}
                </div>
                {tipoFilter && (
                  <button onClick={() => setTipoFilter("")} className="self-start text-xs text-red-400 flex items-center gap-1 mt-2">
                    <X style={{ height: 11, width: 11 }} /> Limpar tipo
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conteúdo */}
      <div className="px-5 pb-10 max-w-5xl mx-auto">

        {/* ── Aba: Assistente IA ── */}
        {aba === "ia" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6"
          >
            <ChatIA isDark={isDark} />
          </motion.div>
        )}

        {/* ── Aba: Acervo ── */}
        {aba === "acervo" && (
          <div className="mt-6">

            {/* Breadcrumb — só aparece quando já escolheu algo e não está buscando por texto */}
            {!emBusca && (cursoSelecionado || anoSelecionado) && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-2 mb-5 text-sm flex-wrap"
              >
                <button
                  onClick={limparSelecao}
                  className="flex items-center gap-1 font-semibold transition-colors"
                  style={{ color: "#1d4ed8" }}
                >
                  <ChevronLeft style={{ height: 15, width: 15 }} />
                  Cursos
                </button>
                <span style={{ color: breadcrumbColor }}>/</span>
                <button
                  onClick={() => setAnoSelecionado(null)}
                  className="font-semibold transition-colors"
                  style={{ color: anoSelecionado ? "#1d4ed8" : textMain }}
                >
                  {cursoSelecionado}
                </button>
                {anoSelecionado && (
                  <>
                    <span style={{ color: breadcrumbColor }}>/</span>
                    <span className="font-semibold" style={{ color: textMain }}>{anoSelecionado}</span>
                  </>
                )}
              </motion.div>
            )}

            {loading ? (
              <div className="flex flex-col items-center gap-3 py-24">
                <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "#1d4ed8", borderTopColor: "transparent" }} />
                <p className="text-sm" style={{ color: textMuted }}>Carregando trabalhos...</p>
              </div>
            ) : emBusca ? (
              /* ── Resultado de busca por texto (ignora seleção guiada) ── */
              filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: emptyIconBg }}>
                    <BookOpen style={{ height: 28, width: 28, color: emptyIconColor }} />
                  </div>
                  <p className="text-base font-semibold" style={{ color: textMain }}>Nenhum trabalho encontrado</p>
                  <p className="text-sm" style={{ color: textMuted }}>Tente ajustar sua busca</p>
                  <button onClick={limparFiltros}
                    className="mt-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
                    style={{ background: emptyBtnBg, color: emptyBtnColor, border: `1px solid ${emptyBtnBorder}` }}>
                    Limpar busca
                  </button>
                </motion.div>
              ) : (
                <>
                  <p className="text-xs mb-4" style={{ color: textFaintest }}>
                    {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para "{search}"
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filtered.map((tcc, i) => (
                      <motion.div key={tcc._id || tcc.id}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <TCCCard tcc={tcc} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )
            ) : !cursoSelecionado ? (
              /* ── Passo 1: escolher o curso ── */
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm font-semibold mb-3" style={{ color: textMuted }}>
                  Escolha o curso
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cursos.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCursoSelecionado(c)}
                      className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all"
                      style={{ background: selectCardBg, border: `1px solid ${selectCardBorder}` }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = selectCardHoverBorder)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = selectCardBorder)}
                    >
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(29,78,216,0.12)" }}>
                        <GraduationCap style={{ height: 22, width: 22, color: "#1d4ed8" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold" style={{ color: textMain }}>{c}</p>
                        <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                          {contagemPorCurso[c] || 0} trabalho{(contagemPorCurso[c] || 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ChevronRight style={{ height: 18, width: 18, color: textFainter, flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : !anoSelecionado ? (
              /* ── Passo 2: escolher o ano dentro do curso ── */
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm font-semibold mb-3" style={{ color: textMuted }}>
                  Escolha o ano em {cursoSelecionado}
                </p>
                {anosDoCurso.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: emptyIconBg }}>
                      <Calendar style={{ height: 28, width: 28, color: emptyIconColor }} />
                    </div>
                    <p className="text-base font-semibold" style={{ color: textMain }}>Nenhum trabalho neste curso ainda</p>
                    <button onClick={limparSelecao}
                      className="mt-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
                      style={{ background: emptyBtnBg, color: emptyBtnColor, border: `1px solid ${emptyBtnBorder}` }}>
                      Escolher outro curso
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {anosDoCurso.map((ano) => (
                      <button
                        key={ano}
                        onClick={() => setAnoSelecionado(ano)}
                        className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl text-center transition-all"
                        style={{ background: selectCardBg, border: `1px solid ${selectCardBorder}` }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = selectCardHoverBorder)}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = selectCardBorder)}
                      >
                        <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(29,78,216,0.12)" }}>
                          <Calendar style={{ height: 20, width: 20, color: "#1d4ed8" }} />
                        </div>
                        <p className="text-lg font-extrabold" style={{ color: textMain }}>{ano}</p>
                        <p className="text-xs" style={{ color: textMuted }}>
                          {contagemPorAno(ano)} trabalho{contagemPorAno(ano) !== 1 ? "s" : ""}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              /* ── Passo 3: lista de TCCs do curso + ano escolhidos ── */
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-2" style={{ background: emptyIconBg }}>
                      <BookOpen style={{ height: 28, width: 28, color: emptyIconColor }} />
                    </div>
                    <p className="text-base font-semibold" style={{ color: textMain }}>Nenhum trabalho encontrado</p>
                    <p className="text-sm" style={{ color: textMuted }}>Tente outro filtro de tipo, ou volte para escolher outro ano</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs mb-4" style={{ color: textFaintest }}>
                      {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filtered.map((tcc, i) => (
                        <motion.div key={tcc._id || tcc.id}
                          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                          <TCCCard tcc={tcc} />
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>
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