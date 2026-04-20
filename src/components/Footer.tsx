import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/30 bg-card/50">
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
              <BookOpen className="h-4 w-4 text-accent" />
            </div>
            <span className="font-serif font-bold text-foreground">TCC Digital - CEEP</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Plataforma digital para acesso e consulta de Trabalhos de Conclusão de Curso do CEEP.
          </p>
        </div>
        <div>
          <h4 className="font-serif font-semibold mb-3 text-accent text-sm">Links</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
            <Link to="/tccs" className="hover:text-foreground transition-colors">TCCs</Link>
            <Link to="/categorias" className="hover:text-foreground transition-colors">Categorias</Link>
          </nav>
        </div>
        <div>
          <h4 className="font-serif font-semibold mb-3 text-accent text-sm">Contato</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>contato@ceep.edu.br</p>
            <p>(00) 0000-0000</p>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border/20 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TCC Digital - CEEP. Todos os direitos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
