import { motion } from "framer-motion";
import { useTheme } from "@/hooks/ThemeContext";
import { BookOpen, GraduationCap, Users, Target, Heart, Code2 } from "lucide-react";

const criadores = [
  {
    nome: "Lucas Medeiros",
    papel: "Desenvolvedor Full Stack",
    descricao: "Responsável pela arquitetura do sistema, desenvolvimento do backend e frontend da plataforma.",
    foto: "/lucas.jpg",
    cor: "#1d4ed8",
  },
  {
    nome: "Emanuelly Oliveira",
    papel: "Design & UX",
    descricao: "Responsável pelo design da interface, experiência do usuário e identidade visual do projeto.",
    foto: "/emanuelly.jpg",
    cor: "#ef4444",
  },
  {
    nome: "Victor Yuri",
    papel: "Desenvolvedor & Documentação",
    descricao: "Responsável pelo desenvolvimento de funcionalidades e pela documentação técnica do projeto.",
    foto: "/victor.jpg",
    cor: "#8b5cf6",
  },
];

const valores = [
  { Icon: BookOpen,     title: "Conhecimento",  desc: "Acreditamos que o conhecimento deve ser acessível a todos os estudantes.",         color: "#1d4ed8" },
  { Icon: Users,        title: "Colaboração",   desc: "Construído por estudantes, para estudantes. A troca de conhecimento nos fortalece.", color: "#ef4444" },
  { Icon: Target,       title: "Propósito",     desc: "Cada TCC representa dedicação e esforço. Queremos preservar e valorizar isso.",      color: "#10b981" },
  { Icon: Heart,        title: "Paixão",        desc: "Desenvolvemos este projeto com amor pela educação e pela tecnologia.",              color: "#f5a623" },
];

const Sobre = () => {
  const { isDark } = useTheme();

  const pageBg      = isDark ? "#0b1220" : "#ffffff";
  const heroBg      = isDark ? "linear-gradient(160deg,#0b1220 0%,#0f1a30 50%,#132a52 100%)" : "linear-gradient(160deg,#f0f4ff 0%,#e8f0ff 100%)";
  const cardBg      = isDark ? "#111f38" : "#ffffff";
  const cardBorder  = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const textMain    = isDark ? "#ffffff" : "#0f172a";
  const textMuted   = isDark ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.6)";
  const sectionBg   = isDark ? "#0f1a30" : "#f8fafc";
  const sectionBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const badgeBg     = isDark ? "rgba(29,78,216,0.15)" : "rgba(29,78,216,0.08)";

  return (
    <div className="min-h-screen transition-colors" style={{ background: pageBg }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20" style={{ background: heroBg }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle,currentColor 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(29,78,216,0.15) 0%,transparent 70%)" }} />

        <div className="container mx-auto px-5 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold"
              style={{ background: badgeBg, border: "1px solid rgba(29,78,216,0.3)", color: "#1d4ed8" }}>
              <BookOpen style={{ height: 11, width: 11 }} />
              Sobre o Projeto
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: textMain }}>
              TCC Digital<br />
              <span style={{ color: "#1d4ed8" }}>CEEP</span>
            </h1>

            <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: textMuted }}>
              Uma plataforma criada por estudantes do{" "}
              <span className="font-semibold" style={{ color: textMain }}>
                Centro Estadual de Educação Profissional
              </span>{" "}
              para preservar, compartilhar e valorizar o conhecimento produzido pela nossa escola.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Sobre o projeto ── */}
      <section className="container mx-auto px-5 py-14 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl p-8 md:p-10" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(29,78,216,0.12)", border: "1px solid rgba(29,78,216,0.2)" }}>
              <GraduationCap style={{ height: 22, width: 22, color: "#1d4ed8" }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: textMain }}>O que é o TCC Digital?</h2>
              <p className="text-xs" style={{ color: textMuted }}>Centro Estadual de Educação Profissional</p>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed" style={{ color: textMuted }}>
            <p>
              O <span className="font-semibold" style={{ color: textMain }}>TCC Digital CEEP</span> é uma biblioteca digital desenvolvida por alunos do curso de Informática do CEEP — Centro Estadual de Educação Profissional. O projeto nasceu da necessidade de criar um espaço centralizado onde os trabalhos acadêmicos dos estudantes pudessem ser preservados, acessados e compartilhados de forma simples e moderna.
            </p>
            <p>
              Antes desta plataforma, os TCCs e apostilas ficavam dispersos, muitas vezes perdidos ao longo do tempo. Agora, qualquer aluno pode acessar o acervo completo da escola, encontrar referências para seus próprios projetos e se inspirar no trabalho dos colegas.
            </p>
            <p>
              A plataforma conta com busca avançada por título, autor e curso, integração com inteligência artificial para recomendação de TCCs por tema, e um sistema de administração para gerenciar o acervo com segurança.
            </p>
            <p>
              Este projeto é uma prova de que <span className="font-semibold" style={{ color: "#1d4ed8" }}>estudantes podem criar soluções reais</span> para problemas reais — e que o conhecimento produzido dentro da escola merece ser preservado e celebrado.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Nossos valores ── */}
      <section className="py-14" style={{ background: sectionBg, borderTop: `1px solid ${sectionBorder}`, borderBottom: `1px solid ${sectionBorder}` }}>
        <div className="container mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2" style={{ color: textMain }}>Nossos valores</h2>
            <p className="text-sm" style={{ color: textMuted }}>O que nos motiva a construir esta plataforma</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {valores.map(({ Icon, title, desc, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-5 flex flex-col items-center text-center gap-3"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon style={{ height: 22, width: 22, color }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: textMain }}>{title}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: textMuted }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Criadores ── */}
      <section className="container mx-auto px-5 py-14 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-semibold"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>
            <Code2 style={{ height: 11, width: 11 }} />
            Quem fez isso acontecer
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: textMain }}>Os Criadores</h2>
          <p className="text-sm" style={{ color: textMuted }}>
            Estudantes do CEEP que transformaram uma ideia em realidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {criadores.map(({ nome, papel, descricao, foto, cor }, i) => (
            <motion.div key={nome}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>

              {/* Foto */}
              <div className="h-64 overflow-hidden relative"
                style={{ background: `linear-gradient(135deg,${cor}22,${cor}08)` }}>
                <img
                  src={foto}
                  alt={nome}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${isDark ? "#111f38" : "#ffffff"}ee 0%, transparent 50%)` }} />
              </div>

              {/* Info */}
              <div className="px-5 pb-5 -mt-6 relative z-10">
                <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full mb-2"
                  style={{ background: `${cor}18`, color: cor, border: `1px solid ${cor}33` }}>
                  {papel}
                </span>
                <h3 className="text-base font-bold" style={{ color: textMain }}>{nome}</h3>
                <p className="text-xs mt-1.5 leading-relaxed" style={{ color: textMuted }}>{descricao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Rodapé motivacional ── */}
      <section className="py-16" style={{ background: "linear-gradient(135deg,#0f1a30,#132a52)", borderTop: `1px solid ${sectionBorder}` }}>
        <div className="container mx-auto px-5 text-center max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-4xl mb-5">🎓</div>
            <h2 className="text-2xl font-extrabold text-white mb-4">
              "O conhecimento é a única riqueza<br />que cresce quando compartilhada."
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
              Este projeto é dedicado a todos os estudantes do CEEP — passados, presentes e futuros — que dedicaram horas de estudo, pesquisa e determinação para produzir conhecimento que transforma vidas.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
              style={{ background: "rgba(29,78,216,0.2)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa" }}>
              <Heart style={{ height: 11, width: 11 }} />
              Feito com amor por alunos do CEEP · 2025
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Sobre;