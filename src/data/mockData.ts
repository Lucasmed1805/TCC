export interface TCC {
  id: string;
  titulo: string;
  autor: string;
  curso: string;
  ano: number;
  descricao: string;
  palavrasChave: string[];
  downloads: number;
  visualizacoes: number;
  dataCadastro: string;
}

export const cursos = [
  "Informática",
  "Redes de Computadores",
];

export const tccs: TCC[] = [
  {
    id: "1",
    titulo: "Desenvolvimento de Aplicações Web com React e Node.js",
    autor: "Maria Silva Santos",
    curso: "Informática",
    ano: 2024,
    descricao: "Este trabalho aborda o desenvolvimento de aplicações web modernas utilizando React no frontend e Node.js no backend, com foco em boas práticas e padrões de projeto. A pesquisa inclui análise comparativa de frameworks modernos e implementação de um sistema completo com autenticação e gerenciamento de estado.",
    palavrasChave: ["React", "Node.js", "Web", "JavaScript"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2024-06-15",
  },
  {
    id: "2",
    titulo: "Inteligência Artificial Aplicada à Automação de Redes",
    autor: "João Pedro Oliveira",
    curso: "Redes de Computadores",
    ano: 2024,
    descricao: "Análise da aplicação de técnicas de inteligência artificial na automação e monitoramento de redes de computadores, com foco em detecção de anomalias e otimização de tráfego.",
    palavrasChave: ["IA", "Redes", "Automação", "Monitoramento"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2024-05-20",
  },
  {
    id: "3",
    titulo: "Segurança em Redes Sem Fio: Vulnerabilidades e Contramedidas",
    autor: "Ana Carolina Ferreira",
    curso: "Redes de Computadores",
    ano: 2023,
    descricao: "Estudo sobre as principais vulnerabilidades em redes Wi-Fi e técnicas de proteção, incluindo análise prática de protocolos WPA3 e implementação de políticas de segurança.",
    palavrasChave: ["Segurança", "Wi-Fi", "WPA3", "Redes"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2023-11-10",
  },
  {
    id: "4",
    titulo: "Banco de Dados NoSQL: MongoDB na Prática",
    autor: "Rafael Augusto Pereira",
    curso: "Informática",
    ano: 2023,
    descricao: "Implementação e comparação de performance entre bancos de dados relacionais e NoSQL, com foco em MongoDB para aplicações de alta escalabilidade e sistemas distribuídos.",
    palavrasChave: ["MongoDB", "NoSQL", "Banco de Dados", "Performance"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2023-09-22",
  },
  {
    id: "5",
    titulo: "Desenvolvimento Mobile com React Native e TypeScript",
    autor: "Lucas Mendes Costa",
    curso: "Informática",
    ano: 2024,
    descricao: "Pesquisa sobre desenvolvimento de aplicativos mobile multiplataforma utilizando React Native com TypeScript, explorando padrões de arquitetura e integração com APIs REST.",
    palavrasChave: ["React Native", "Mobile", "TypeScript", "API"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2024-03-08",
  },
  {
    id: "6",
    titulo: "Implementação de VPN Corporativa com OpenVPN",
    autor: "Fernanda Lima Souza",
    curso: "Redes de Computadores",
    ano: 2024,
    descricao: "Projeto de implementação de uma VPN corporativa utilizando OpenVPN, com análise de performance, segurança e escalabilidade para ambientes empresariais.",
    palavrasChave: ["VPN", "OpenVPN", "Segurança", "Infraestrutura"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2024-04-12",
  },
  {
    id: "7",
    titulo: "Machine Learning para Detecção de Intrusão em Redes",
    autor: "Camila Rodrigues Alves",
    curso: "Redes de Computadores",
    ano: 2023,
    descricao: "Aplicação de algoritmos de machine learning na detecção de intrusões em redes corporativas, com análise comparativa de modelos supervisionados e não supervisionados.",
    palavrasChave: ["Machine Learning", "IDS", "Segurança", "Redes"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2023-12-01",
  },
  {
    id: "8",
    titulo: "Computação em Nuvem: AWS vs Azure para Startups",
    autor: "Beatriz Santos Lima",
    curso: "Informática",
    ano: 2024,
    descricao: "Análise comparativa entre Amazon Web Services e Microsoft Azure para startups de tecnologia, avaliando custos, escalabilidade, facilidade de uso e ecossistema de serviços.",
    palavrasChave: ["Cloud", "AWS", "Azure", "Infraestrutura"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2024-02-28",
  },
  {
    id: "9",
    titulo: "Arquitetura de Microsserviços com Docker e Kubernetes",
    autor: "Pedro Henrique Almeida",
    curso: "Informática",
    ano: 2023,
    descricao: "Estudo e implementação de uma arquitetura baseada em microsserviços utilizando Docker para containerização e Kubernetes para orquestração, com foco em alta disponibilidade.",
    palavrasChave: ["Docker", "Kubernetes", "Microsserviços", "DevOps"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2023-08-15",
  },
  {
    id: "10",
    titulo: "Monitoramento de Redes com Zabbix e Grafana",
    autor: "Thiago Costa Barbosa",
    curso: "Redes de Computadores",
    ano: 2024,
    descricao: "Implementação de um sistema de monitoramento de infraestrutura de rede utilizando Zabbix e Grafana, com dashboards customizados e alertas automatizados.",
    palavrasChave: ["Zabbix", "Grafana", "Monitoramento", "NOC"],
    downloads: 0,
    visualizacoes: 0,
    dataCadastro: "2024-01-18",
  },
];

export const stats = {
  totalTccs: tccs.length,
  totalDownloads: tccs.reduce((acc, t) => acc + t.downloads, 0),
  totalVisualizacoes: tccs.reduce((acc, t) => acc + t.visualizacoes, 0),
  totalCursos: cursos.length,
};
