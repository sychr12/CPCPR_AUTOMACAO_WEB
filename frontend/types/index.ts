export interface Municipio {
  id: number
  nome: string
  codigo?: string
}

export interface InscRenov {
  id: number
  cpf: string
  nome: string
  municipio: string
  data: string

  unloc?: string
  memorando?: string
  urgente?: boolean
  lancado?: boolean
}

export interface InscRenov {
  id: number
  nome: string
  cpf: string
  processo: string
  data: string

  unloc?: string
  descricao?: string
  lancou?: boolean
  urgente?: boolean
}


export interface Dev {
  id: number
  cpf: string
  nome: string
  motivo: string
  processo?: string
  valor?: number
  data: string
}

export interface DevRequest {
  cpf: string
  nome?: string
  motivo: string
}

export interface FiltroConsulta {
  cpf?: string
  nome?: string
  municipio?: string
  unloc?: string
}


export interface DevRequest {
  datas: string[]
  unloc?: string
  memorando?: string
}


export interface DevRequest {
  datas: string[]
}

interface BaseRequest {
  datas: string[]
  unloc?: string
  memorando?: string
}

export interface InscRenovRequest extends BaseRequest {}

export interface DevRequest extends BaseRequest {}


export interface InscRenov {
  id: number
  nome: string
  cpf: string
  processo: string
  data: string
  unloc?: string
}

interface BaseRequest {
  datas: string[]
  unloc?: string
  memorando?: string
}

export interface InscRenovRequest extends BaseRequest {}

export interface DevRequest extends BaseRequest {}

interface BaseRequest {
  datas: string[]
  nome?: string
  cpf?: string
  unloc?: string
  memorando?: string
  motivo?: string
}

export interface InscRenovRequest extends BaseRequest {
  descricao?: 'INSC' | 'RENOV'
  urgente?: boolean
}

export interface DevRequest extends BaseRequest {}