import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import TCCCard from "@/components/TCCCard";

const API = "http://localhost:8080/api";
const cursos = ["Informática", "Redes de Computadores"];

const TCCList = () => {
  const [searchParams] = useSearchParams();
  const [tccs, setTccs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cursoFilter, setCursoFilter] = useState(searchParams.get("curso") || "");
  const [anoFilter, setAnoFilter] = useState("");

  useEffect(() => {
    fetch(`${API}/tccs`)
      .then((r) => r.json())
      .then((data) => { setTccs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const anos = [...new Set(tccs.map((t) => t.ano))].sort((a, b) => b - a);

  const filtered = tccs.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.titulo.toLowerCase().includes(q) || t.autor.toLowerCase().includes(q);
    const matchCurso = !cursoFilter || cursoFilter === "all" || t.curso === cursoFilter;
    const matchAno = !anoFilter || anoFilter === "all" || t.ano === Number(anoFilter);
    return matchSearch && matchCurso && matchAno;
  });

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl font-bold mb-2 text-foreground">Acervo de TCCs</h1>
        <p className="text-muted-foreground mb-8 text-sm">Pesquise e explore todos os trabalhos disponíveis</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-3 mb-8 p-4 rounded-xl border border-border/40 bg-card/50"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por título ou autor..." value={search}
            onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-background border-border/40" />
        </div>
        <Select value={cursoFilter} onValueChange={setCursoFilter}>
          <SelectTrigger className="w-full md:w-52 bg-background border-border/40">
            <SelectValue placeholder="Todos os cursos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cursos</SelectItem>
            {cursos.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={anoFilter} onValueChange={setAnoFilter}>
          <SelectTrigger className="w-full md:w-36 bg-background border-border/40">
            <SelectValue placeholder="Todos os anos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os anos</SelectItem>
            {anos.map((a) => <SelectItem key={a} value={String(a)}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Carregando...</div>
      ) : filtered.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-6">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((tcc, i) => (
              <motion.div key={tcc.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <TCCCard tcc={tcc} />
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <SlidersHorizontal className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg font-semibold text-foreground">Nenhum TCC encontrado</p>
          <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </div>
  );
};

export default TCCList;