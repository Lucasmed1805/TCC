import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, X, Send, BookOpen, ChevronRight, Loader2 } from "lucide-react";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}`;

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

const IAFlutuante = () => {
  const [aberto, setAberto] = useState(false);
  const [ideia, setIdeia] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [carregando, setCarregando] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens, carregando]);

  useEffect(() => {
    if (aberto) setTimeout(() => inputRef.current?.focus(), 100);
  }, [aberto]);

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
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setAberto(!aberto)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white shadow-2xl transition-all active:scale-95"
        style={{
          background: aberto
            ? "rgba(15,31,61,0.95)"
            : "linear-gradient(135deg,#1a4fa0,#2563eb)",
          border: "1px solid rgba(96,165,250,0.3)",
          boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
        }}
      >
        {aberto ? (
          <X style={{ height: 18, width: 18 }} />
        ) : (
          <>
            <Sparkles style={{ height: 16, width: 16 }} />
            Inspiração IA
          </>
        )}
      </button>

      {/* Painel do chat */}
      {aberto && (
        <div
          className="fixed bottom-20 right-6 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: "min(420px, calc(100vw - 24px))",
            height: "min(560px, calc(100vh - 120px))",
            background: "#060e1f",
            border: "1px solid rgba(96,165,250,0.15)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(96,165,250,0.08)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 shrink-0"
            style={{
              background: "linear-gradient(135deg,#0a1628,#0d2550)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(37,99,235,0.25)", border: "1px solid rgba(96,165,250,0.2)" }}
            >
              <Sparkles style={{ height: 16, width: 16, color: "#60a5fa" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Inspiração IA</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                Descreva sua ideia e encontre TCCs para se inspirar
              </p>
            </div>
          </div>

          {/* Mensagens */}
          <div
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(96,165,250,0.15) transparent" }}
          >
            {/* Mensagem inicial */}
            {mensagens.length === 0 && (
              <div
                className="rounded-2xl p-4 text-sm"
                style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(96,165,250,0.12)" }}
              >
                <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <Sparkles style={{ height: 13, width: 13, color: "#60a5fa" }} />
                  Olá! Sou o assistente do TCC Digital.
                </p>
                <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                  Descreva a ideia do seu TCC e eu vou encontrar os trabalhos do acervo que mais combinam com o seu tema para te inspirar! ✨
                </p>
              </div>
            )}

            {mensagens.map((msg, i) => (
              <div key={i}>
                {msg.tipo === "usuario" && (
                  <div className="flex justify-end">
                    <div
                      className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white"
                      style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}
                    >
                      {msg.texto}
                    </div>
                  </div>
                )}

                {msg.tipo === "ia" && (
                  <div className="space-y-3">
                    {/* Texto da IA */}
                    <div
                      className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "rgba(255,255,255,0.8)",
                        lineHeight: 1.7,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.texto}
                    </div>

                    {/* Cards dos TCCs recomendados */}
                    {msg.recomendados && msg.recomendados.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider px-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                          Ver no acervo
                        </p>
                        {msg.recomendados.map((tcc) => (
                          <button
                            key={tcc._id}
                            onClick={() => { navigate(`/tcc/${tcc._id}`); setAberto(false); }}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group"
                            style={{
                              background: "rgba(37,99,235,0.08)",
                              border: "1px solid rgba(96,165,250,0.12)",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(37,99,235,0.16)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(37,99,235,0.08)")}
                          >
                            <div
                              className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: "rgba(37,99,235,0.2)" }}
                            >
                              <BookOpen style={{ height: 14, width: 14, color: "#60a5fa" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{tcc.titulo}</p>
                              <p className="text-[10px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                                {tcc.autor} · {tcc.curso} · {tcc.ano}
                              </p>
                            </div>
                            <ChevronRight style={{ height: 14, width: 14, color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-tl-sm w-fit"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Loader2 style={{ height: 14, width: 14, color: "#60a5fa", animation: "spin 1s linear infinite" }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Analisando o acervo...</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="px-4 py-3 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            <div
              className="flex items-end gap-2 rounded-xl px-3 py-2"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <textarea
                ref={inputRef}
                value={ideia}
                onChange={(e) => setIdeia(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Descreva a ideia do seu TCC..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-white outline-none resize-none"
                style={{
                  color: "white",
                  maxHeight: "100px",
                  lineHeight: 1.5,
                  paddingTop: "4px",
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 100) + "px";
                }}
              />
              <button
                onClick={enviar}
                disabled={!ideia.trim() || carregando}
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
                style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}
              >
                <Send style={{ height: 13, width: 13, color: "white" }} />
              </button>
            </div>
            <p className="text-[9px] text-center mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
              Enter para enviar · Shift+Enter para nova linha
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default IAFlutuante;