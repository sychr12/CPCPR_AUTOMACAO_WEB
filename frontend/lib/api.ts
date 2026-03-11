import axios from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Auth Store ────────────────────────────────────────────────────
interface AuthState {
  token: string | null
  usuario: { nome: string; perfil: string } | null
  setAuth: (token: string, usuario: { nome: string; perfil: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      setAuth: (token, usuario) => set({ token, usuario }),
      logout: () => set({ token: null, usuario: null }),
    }),
    { name: 'carteira-auth' }
  )
)

// ── Axios instance ────────────────────────────────────────────────
const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      if (typeof window !== 'undefined') window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  login:       (data: any) => api.post('/auth/login', data),
  trocarSenha: (data: any) => api.post('/auth/trocar-senha', data),
  me:          ()          => api.get('/auth/me'),
}

// ── InscRenov ─────────────────────────────────────────────────────
export const inscRenovApi = {
  listar:    (params?: Record<string, any>) => api.get('/inscrenov', { params }),
  buscar:    (cpf: string)                  => api.get(`/inscrenov/cpf/${cpf}`),
  criar:     (data: any)                    => api.post('/inscrenov', data),
  criarLote: (data: any[])                  => api.post('/inscrenov/batch', data),
  atualizar: (id: number, data: any)        => api.put(`/inscrenov/${id}`, data),
  deletar:   (id: number)                   => api.delete(`/inscrenov/${id}`),
  lancar:    (id: number)                   => api.patch(`/inscrenov/${id}/lancar`),
}

// ── Dev ───────────────────────────────────────────────────────────
export const devApi = {
  listar:      (params?: Record<string, any>) => api.get('/dev', { params }),
  buscar:      (cpf: string)                  => api.get(`/dev/cpf/${cpf}`),
  criar:       (data: any)                    => api.post('/dev', data),
  criarLote:   (data: any[])                  => api.post('/dev/batch', data),
  atualizar:   (id: number, data: any)        => api.put(`/dev/${id}`, data),
  deletar:     (id: number)                   => api.delete(`/dev/${id}`),
  pendentes:   ()                             => api.get('/dev/pendentes'),
  marcarEnvio: (data: any)                    => api.patch('/dev/marcar-enviado', data),
}

// ── Municípios ────────────────────────────────────────────────────
export const municipioApi = {
  buscar: (q: string) => api.get('/municipios', { params: { q } }),
  todos:  ()          => api.get('/municipios/todos'),
}

// ── Dashboard ─────────────────────────────────────────────────────
export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
}