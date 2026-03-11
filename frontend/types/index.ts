// ── Auth ──────────────────────────────────────────────────────────
export interface LoginRequest {
  nome: string
  senha: string
}

export interface LoginResponse {
  token: string
  nome: string
  perfil: string
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
}

export interface DevRequest {
  nome: string
  cpf: string
  unloc: string
  memorando: string
  motivo: string
  analise?: string
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
}

export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  currentPage: number
  pageSize: number
}

// ── Outros ────────────────────────────────────────────────────────
export interface Municipio {
  codigo: string
  nome: string
}

export interface DashboardStats {
  totalInscricoes: number
  totalRenovacoes: number
  totalDevolucoes: number
  total: number
}