import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import TCCCard from "@/components/TCCCard";
import type { TCC } from "@/types/tcc";

interface TCCCarouselProps {
  title: string;
  subtitle?: string;
  tccs: TCC[];
}

const TCCCarousel = ({ title, subtitle, tccs }: TCCCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (tccs.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2
            className="font-bold text-foreground flex items-center gap-2"
            style={{ fontSize: "15px" }}
          >
            <span
              className="inline-block w-1 h-4 rounded-full shrink-0"
              style={{ background: "#e85d04" }}
            />
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 ml-3">{subtitle}</p>
          )}
        </div>

        <div className="hidden md:flex gap-1">
          <button
            onClick={() => scroll("left")}
            className="h-8 w-8 rounded-full bg-white border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="h-8 w-8 rounded-full bg-white border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-300 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto carousel-scroll pb-2 -mx-2 px-2"
      >
        {tccs.map((tcc) => (
          <div key={tcc.id} className="flex-shrink-0 w-[260px]">
            <TCCCard tcc={tcc} />
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default TCCCarousel;