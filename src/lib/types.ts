// Tipos baseados nos ENUMs do banco de dados
export type UserRole = 'deputado' | 'lideranca' | 'assessoria';
export type ContatoStatus = 'pendente' | 'aprovado' | 'rejeitado';
export type EmendaStatus = 'proposta' | 'aprovada' | 'empenhada' | 'executada' | 'bloqueada';
export type ObraStatus = 'planejada' | 'em_andamento' | 'concluida' | 'paralisada';
export type MidiaTipo = 'foto' | 'documento';
export type PendenciaPrioridade = 'baixa' | 'media' | 'alta' | 'urgente';
export type PendenciaStatus = 'aberta' | 'em_tratativa' | 'resolvida';

// Tipos baseados nas tabelas do banco de dados

export interface Municipio {
  id: string; // uuid
  nome: string;
  regiao?: string | null;
  populacao?: number | null;
  created_at: string; // timestamptz
  contatos?: { count: number }[]; 
  emendas?: { count: number }[];
}

export interface Perfil {
  id: string; // uuid
  nome?: string | null;
  role: UserRole;
  status?: string | null;
  municipio_id?: string | null; // uuid
}

export interface Contato {
  id: string; // uuid
  municipio_id: string; // uuid
  enviado_por?: string | null; // uuid
  nome: string;
  telefone?: string | null;
  email?: string | null;
  tags?: string[] | null;
  status: ContatoStatus;
  consentiu: boolean;
  created_at: string; // timestamptz
}

export interface Politico {
  id: string; // uuid
  municipio_id: string; // uuid
  cargo?: string | null;
  nome: string;
  partido?: string | null;
  telefone?: string | null;
  aliado: boolean;
}

export interface Emenda {
  id: string; // uuid
  municipio_id: string; // uuid
  titulo: string;
  valor?: number | null; // numeric
  area?: string | null;
  status: EmendaStatus;
  ano?: number | null;
  observacoes?: string | null;
}

export interface Obra {
  id: string; // uuid
  municipio_id: string; // uuid
  titulo: string;
  descricao?: string | null;
  status: ObraStatus;
  emenda_id?: string | null; // uuid
  previsao_conclusao?: string | null; // date
}

export interface Evento {
  id: string; // uuid
  municipio_id: string; // uuid
  titulo: string;
  descricao?: string | null;
  data_hora?: string | null; // timestamptz
  local?: string | null;
  tipo?: string | null;
}

export interface Nota {
  id: string; // uuid
  municipio_id: string; // uuid
  autor_id?: string | null; // uuid
  conteudo: string;
  created_at: string; // timestamptz
}

export interface Midia {
  id: string; // uuid
  municipio_id: string; // uuid
  url: string;
  legenda?: string | null;
  tipo: MidiaTipo;
  created_at: string; // timestamptz
}

export interface Pendencia {
  id: string; // uuid
  municipio_id: string; // uuid
  titulo: string;
  descricao?: string | null;
  tipo?: string | null;
  prioridade: PendenciaPrioridade;
  status: PendenciaStatus;
  responsavel_id?: string | null; // uuid
  prazo?: string | null; // date
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
}
