import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Eye, Calendar, User, Tag, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const API = "http://localhost:3001/api";

const TCCDetail = () => {
  const { id } = useParams();
  const [tcc, setTcc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/tccs/${id}`)
      .then((r) => r.json())
      .then((data) => { setTcc(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    await fetch(`${API}/tccs/${id}/download`, { method: "POST" });
    if (tcc?.arquivo_url) {
      window.open(`http://localhost:3001${tcc.arquivo_url}`, "_blank");
    }
  };

  if (loading) return <div className="container py-20 text-center text-muted-foreground">Carregando...</div>;

  if (!tcc) return (
    <div className="container py-20 text-center">
      <p className="text-lg font-semibold text-foreground">TCC não encontrado</p>
      <Link to="/tccs"><Button variant="outline" className="mt-4">Voltar ao acervo</Button></Link>
    </div>
  );

  return (
    <div className="container py-10">
      <Link to="/tccs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar ao acervo
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 mb-4">
            {tcc.curso}
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-foreground leading-tight">{tcc.titulo}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{tcc.autor}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{tcc.ano}</span>
            <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{tcc.visualizacoes} visualizações</span>
            <span className="flex items-center gap-1.5"><Download className="h-4 w-4" />{tcc.downloads} downloads</span>
          </div>

          {tcc.resumo && (
            <div className="mb-6">
              <h3 className="font-serif font-semibold mb-2 text-foreground">Resumo</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{tcc.resumo}</p>
            </div>
          )}

          <div className="rounded-xl border border-border/40 bg-card/50 p-10 text-center mb-8">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
            <p className="font-semibold mb-1 text-foreground">Arquivo PDF</p>
            {tcc.arquivo_url ? (
              <div className="flex justify-center gap-3 mt-4">
                <Button variant="gold" className="gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" /> Baixar PDF
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum arquivo disponível para este TCC.</p>
            )}
          </div>
        </div>

        <aside>
          <div className="rounded-xl border border-border/40 bg-card/50 p-5 sticky top-20">
            <h3 className="font-serif font-semibold mb-4 text-foreground">Informações</h3>
            <dl className="space-y-3 text-sm">
              {[
                { label: "Autor", value: tcc.autor },
                { label: "Curso", value: tcc.curso },
                { label: "Ano", value: tcc.ano },
                { label: "Tipo", value: tcc.tipo?.toUpperCase() },
                { label: "Downloads", value: tcc.downloads },
                { label: "Visualizações", value: tcc.visualizacoes },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="font-medium text-foreground text-right">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </motion.div>
    </div>
  );
};

export default TCCDetail;