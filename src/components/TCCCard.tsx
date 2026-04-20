import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import type { TCC } from "@/types/tcc";

const courseColors: Record<string, { from: string; to: string }> = {
  "Informática":            { from: "#2c3e6b", to: "#354872" },
  "Redes de Computadores":  { from: "#2a4a48", to: "#325450" },
};

const TCCCard = ({ tcc }: { tcc: TCC }) => {
  const colors = courseColors[tcc.curso] ?? { from: "#334155", to: "#475569" };

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-border/60 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer">
      <Link to={`/tcc/${tcc.id}`} className="block">
        <div
          className="h-28 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          }}
        >
          <FileText className="h-10 w-10 text-white/60" />
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 mb-1 group-hover:text-blue-700 transition-colors">
            {tcc.titulo}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">{tcc.autor}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className="flex items-center gap-1 text-[11px] font-semibold"
                style={{ color: "#e85d04" }}
              >
                <FileText className="h-3 w-3" /> TCC
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                style={{ background: "#eff6ff", color: "#1a4fa0" }}
              >
                PDF
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">{tcc.ano}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TCCCard;