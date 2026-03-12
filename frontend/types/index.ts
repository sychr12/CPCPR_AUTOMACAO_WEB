// ── Auth ──────────────────────────────────────────────────────────
export interface LoginRequest {
  nome: string
  senha: string
}

export interface LoginResponse {
  token: string
  nome: string
  perfil: string

  // novas opções (não quebram código antigo)
  expiraEm?: number
  refreshToken?: string
}

export interface TrocarSenhaRequest {
  senhaAtual: string
  novaSenha: string
}

export interface Usuario {
  id: number
  nome: string
  perfil: string
  ativo: boolean

  // opções extras
  criadoEm?: string
  ultimoLogin?: string
}



// ── InscRenov ─────────────────────────────────────────────────────
export interface InscRenov {
  id: number
  nome: string
  cpf: string
  unloc: string
  memorando: string
  datas: string
  descricao: string
  analise?: string
  lancou?: string
  datalan?: string
  urgente?: boolean

  // opções extras
  observacao?: string
  criadoEm?: string
  atualizadoEm?: string
}

export interface InscRenovRequest {
  nome: string
  cpf: string
  unloc: string
  memorando: string
  datas: string
  descricao: 'INSC' | 'RENOV'
  analise?: string
  urgente?: boolean

  // novas opções possíveis
  observacao?: string
}



// ── Dev ───────────────────────────────────────────────────────────
export interface Dev {
  id: number
  nome: string
  cpf: string
  unloc: string
  memorando: string
  motivo: string
  envio?: string
  analise?: string

  // opções extras
  resolvido?: boolean
  resolvidoPor?: string
}

export interface DevRequest {
  nome: string
  cpf: string
  unloc: string
  memorando: string
  motivo: string
  analise?: string

  // novas opções
  prioridade?: 'NORMAL' | 'URGENTE'
}



// ── Filtro / Paginação ────────────────────────────────────────────
export interface FiltroConsulta {
  nome?: string
  cpf?: string
  unloc?: string
  memorando?: string
  descricao?: string
  lancou?: string
  page?: number
  size?: number

  // filtros adicionais
  dataInicio?: string
  dataFim?: string
  urgente?: boolean
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  currentPage: number
  pageSize: number

  // info adicional
  hasNext?: boolean
  hasPrevious?: boolean
}



// ── Outros ────────────────────────────────────────────────────────
export interface Municipio {
  codigo: string
  nome: string

  // extras possíveis
  estado?: string
  ativo?: boolean
}

export interface DashboardStats {
  totalInscricoes: number
  totalRenovacoes: number
  totalDevolucoes: number
  total: number

  // estatísticas extras
  totalUrgentes?: number
  totalHoje?: number
}