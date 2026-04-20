import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Monitor, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { cursos, tccs } from "@/data/mockData";

const icons = [Monitor, Wifi];

const Categorias = () => (
  <div className="container py-10">
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-serif text-3xl font-bold mb-2 text-foreground">Categorias</h1>
      <p className="text-muted-foreground mb-8 text-sm">Explore TCCs organizados por curso</p>
    </motion.div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
      {cursos.map((curso, i) => {
        const count = tccs.filter((t) => t.curso === curso).length;
        const Icon = icons[i] || BookOpen;
        return (
          <motion.div
            key={curso}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={`/tccs?curso=${encodeURIComponent(curso)}`}
              className="group block rounded-xl overflow-hidden border border-border/40 hover:border-accent/30 transition-all"
            >
              <div className="bg-gradient-card p-8 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-accent" />
                </div>
                <h2 className="font-serif text-xl font-bold text-foreground">{curso}</h2>
              </div>
              <div className="p-4 flex items-center justify-between bg-card/50">
                <span className="text-sm text-muted-foreground">{count} trabalho{count !== 1 ? "s" : ""}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default Categorias;
