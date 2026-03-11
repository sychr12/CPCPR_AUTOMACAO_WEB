import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8080/api"
})

export const inscRenovApi = {

  listar: async () => {
    const r = await api.get("/inscricoes")
    return r.data
  },

  buscar: async (cpf: string) => {
    const r = await api.get(`/inscricoes/buscar/${cpf}`)
    return r.data
  },

  criar: async (data: any) => {
    const r = await api.post("/inscricoes", data)
    return r.data
  },

  criarLote: async (data: any[]) => {
    const r = await api.post("/inscricoes/lote", data)
    return r.data
  },

  lancar: async (id: number) => {
    const r = await api.post(`/inscricoes/${id}/lancar`)
    return r.data
  }
}

export const devApi = {

  listar: async () => {
    const r = await api.get("/devolucoes")
    return r.data
  },

  buscar: async (cpf: string) => {
    const r = await api.get(`/devolucoes/buscar/${cpf}`)
    return r.data
  },

  criar: async (data: any) => {
    const r = await api.post("/devolucoes", data)
    return r.data
  },

  criarLote: async (data: any[]) => {
    const r = await api.post("/devolucoes/lote", data)
    return r.data
  },

  pendentes: async () => {
    const r = await api.get("/devolucoes/pendentes")
    return r.data
  },

  marcarEnviado: async (id: number) => {
    const r = await api.post(`/devolucoes/${id}/enviado`)
    return r.data
  },

  deletar: async (id: number) => {
    const r = await api.delete(`/devolucoes/${id}`)
    return r.data
  }
}

export const municipioApi = {

  listar: async () => {
    const r = await api.get("/municipios")
    return r.data
  },

  buscar: async (nome: string) => {
    const r = await api.get(`/municipios/buscar/${nome}`)
    return r.data
  }
}

export const anexarApi = {

  upload: async (formData: FormData) => {
    const r = await api.post("/anexos", formData)
    return r.data
  },

  anexarSIGED: async (formData: FormData) => {
    const r = await api.post("/anexos/siged", formData)
    return r.data
  },

  anexarSEFA: async (formData: FormData) => {
    const r = await api.post("/anexos/sefa", formData)
    return r.data
  }
}