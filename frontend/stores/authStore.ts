import { create } from "zustand"

interface Usuario {
  nome: string
  perfil: string
}

interface AuthState {
  usuario: Usuario | null
  setUsuario: (u: Usuario) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  setUsuario: (u) => set({ usuario: u })
}))