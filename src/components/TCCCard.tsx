import { Link } from "react-router-dom";
import { FileText, Download, Eye } from "lucide-react";
import { useTheme } from "@/hooks/ThemeContext";
import type { TCC } from "@/types/tcc";

const cursoConfig: Record<string, { gradient: string; accent: string }> = {
  "Informática":           { gradient: "linear-gradient(135deg,#1d4ed8,#2563eb44)", accent: "#60a5fa" },
  "Redes de Computadores": { gradient: "linear-gradient(135deg,#b91c1c,#ef444444)", accent: "#f87171" },
};

const TCCCard = ({ tcc }: { tcc: TCC }) => {
  const { isDark } = useTheme();
  const config = cursoConfig[tcc.curso] ?? { gradient: "linear-gradient(135deg,#0f766e,#14b8a644)", accent: "#34d399" };

  const cardBg     = isDark ? "#111f38" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(15,23,42,0.08)";
  const textMain   = isDark ? "#ffffff" : "#0f172a";
  const textMuted  = isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.65)";
  const textFaint  = isDark ? "rgba(255,255,255,0.3)" : "rgba(15,23,42,0.55)";

  return (
    <Link to={`/tcc/${tcc._id || tcc.id}`}
      className="group block rounded-2xl overflow-hidden transition-all active:scale-[0.97]"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>

      {/* Capa */}
      <div className="h-24 flex items-center justify-center relative overflow-hidden"
        style={{ background: config.gradient }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle,white 1px,transparent 1px)", backgroundSize: "16px 16px" }} />
        <div className="h-12 w-12 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <FileText style={{ height: 22, width: 22, color: "#ffffff" }} />
        </div>
        {/* Badge do tipo */}
        <div className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.35)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.3)" }}>
          {tcc.tipo?.toUpperCase() || "TCC"}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-3.5">
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 mb-1.5" style={{ color: textMain }}>
          {tcc.titulo}
        </h3>
        <p className="text-xs mb-3 truncate" style={{ color: textMuted }}>{tcc.autor} · {tcc.ano}</p>

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold px-2 py-1 rounded-lg"
            style={{ background: `${config.accent}18`, color: config.accent }}>
            {tcc.curso?.split(" ")[0]}
          </span>
          <div className="flex items-center gap-2.5 text-[10px]" style={{ color: textFaint }}>
            <span className="flex items-center gap-1"><Eye style={{ height: 10, width: 10 }} />{tcc.visualizacoes || 0}</span>
            <span className="flex items-center gap-1"><Download style={{ height: 10, width: 10 }} />{tcc.downloads || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TCCCard;