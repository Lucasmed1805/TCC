export interface TCC {
  id: string;
  titulo: string;
  autor: string;
  curso: string;
  ano: number;
  resumo?: string;
  tipo?: string;
  arquivo_url?: string | null;
  downloads: number;
  visualizacoes: number;
  criado_em: string;
}