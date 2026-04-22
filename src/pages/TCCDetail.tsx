import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Eye, Calendar, User, BookOpen, GraduationCap, FileText } from "lucide-react";
import { motion } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

const TCCDetail = () => {
  const { id } = useParams();
  const [tcc, setTcc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch(`${API}/tccs/${id}`)
      .then((r) => r.json())
      .then((data) => { setTcc(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await fetch(`${API}/tccs/${id}/download`, { method: "POST" });
      if (tcc?.arquivo_url) {
        window.open(tcc.arquivo_url.startsWith("http") ? tcc.arquivo_url : `${API}${tcc.arquivo_url}`, "_blank");
      }
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#060e1f" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#1a4fa0", borderTopColor: "transparent" }} />
        <p className="text-sm text-white/40">Carregando...</p>
      </div>
    </div>
  );

  if (!tcc) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 gap-4" style={{ background: "#060e1f" }}>
      <BookOpen className="h-16 w-16 text-white/10" />
      <p className="text-lg font-semibold text-white">TCC não encontrado</p>
      <Link to="/tccs"
        className="px-6 py-3 rounded-xl text-sm font-semibold text-white"
        style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)" }}>
        Voltar ao acervo
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#060e1f" }}>

      {/* Header fixo mobile */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-white/10"
        style={{ background: "rgba(6,14,31,0.92)", backdropFilter: "blur(12px)" }}>
        <Link to="/tccs" className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors -ml-1">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{tcc.titulo}</p>
          <p className="text-xs text-white/40 truncate">{tcc.autor}</p>
        </div>
      </div>

      <div className="px-4 pb-10 max-w-2xl mx-auto">

        {/* Badge do curso */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="pt-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "rgba(26,79,160,0.2)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
            <GraduationCap style={{ height: 12, width: 12 }} />
            {tcc.curso}
          </span>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="mt-3 text-xl font-extrabold text-white leading-snug">
          {tcc.titulo}
        </motion.h1>

        {/* Meta info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mt-4 flex flex-wrap gap-3">
          {[
            { Icon: User, label: tcc.autor },
            { Icon: Calendar, label: tcc.ano },
            { Icon: Eye, label: `${tcc.visualizacoes || 0} views` },
            { Icon: Download, label: `${tcc.downloads || 0} downloads` },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-white/50">
              <Icon style={{ height: 13, width: 13 }} />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="mt-5 border-t border-white/8" />

        {/* Resumo */}
        {tcc.resumo && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-5">
            <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span className="inline-block w-1 h-4 rounded-full" style={{ background: "#f5a623" }} />
              Resumo
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">{tcc.resumo}</p>
          </motion.div>
        )}

        {/* Card de informações */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-6 rounded-2xl p-4 grid grid-cols-2 gap-3"
          style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}>
          {[
            { label: "Autor", value: tcc.autor },
            { label: "Curso", value: tcc.curso },
            { label: "Ano", value: tcc.ano },
            { label: "Tipo", value: tcc.tipo?.toUpperCase() },
            { label: "Downloads", value: tcc.downloads || 0 },
            { label: "Visualizações", value: tcc.visualizacoes || 0 },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">{item.label}</span>
              <span className="text-sm font-semibold text-white truncate">{item.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Área do arquivo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="mt-4 rounded-2xl p-5"
          style={{ background: "#111f38", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(239,68,68,0.12)" }}>
              <FileText style={{ height: 20, width: 20, color: "#f87171" }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Arquivo PDF</p>
              <p className="text-xs text-white/40">
                {tcc.arquivo_url ? "Disponível para download" : "Nenhum arquivo disponível"}
              </p>
            </div>
          </div>

          {tcc.arquivo_url ? (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-4 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
              style={{ background: "linear-gradient(135deg,#1a4fa0,#2563eb)", boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}>
              {downloading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Preparando...
                </>
              ) : (
                <>
                  <Download style={{ height: 16, width: 16 }} />
                  Baixar PDF
                </>
              )}
            </button>
          ) : (
            <div className="w-full py-4 rounded-xl text-sm text-white/30 text-center border border-white/10">
              Arquivo não disponível
            </div>
          )}
        </motion.div>

        {/* Voltar ao acervo */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-4">
          <Link to="/tccs"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-medium text-white/50 border border-white/10 hover:text-white hover:border-white/20 transition-all">
            <ArrowLeft style={{ height: 15, width: 15 }} />
            Voltar ao acervo
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default TCCDetail;