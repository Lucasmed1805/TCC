import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TCCCard from "@/components/TCCCard";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const cursos = ["Informática", "Redes de Computadores"];

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
          {/* Botão de filtros */}
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
                {/* Filtro de curso */}
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

                {/* Filtro de ano */}
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

                {/* Limpar filtros */}
                {temFiltros && (
                  <button onClick={limparFiltros}
                    className="self-start text-xs text-red-400 flex items-center gap-1 mt-1">
                    <X style={{ height: 11, width: 11 }} /> Limpar filtros
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conteúdo */}
      <div className="px-5 pb-10">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-24">
            <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#1a4fa0", borderTopColor: "transparent" }} />
            <p className="text-sm text-white/40">Carregando trabalhos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-24 text-center">
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
            <p className="text-xs text-white/30 mt-5 mb-4">
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
    </div>
  );
};

export default TCCList;