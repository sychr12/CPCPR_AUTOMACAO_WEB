'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle
} from 'lucide-react'

import { authApi, useAuthStore } from '@/lib/api'
import type { LoginRequest } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({ nome: '', senha: '' })
  const [showSenha, setShowSenha] = useState(false)
  const [erro, setErro] = useState('')

  const login = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (r) => {
      setAuth(r.data.token, r.data.usuario)
      router.replace('/dashboard')
    },
    onError: () => {
      setErro('Usuário ou senha inválidos.')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (!form.nome || !form.senha) {
      setErro('Preencha todos os campos.')
      return
    }

    login.mutate(form)
  }

  return (
    <div className="login-container">

      <div className="login-box">

        <div className="logo">
          <LogIn size={28} />
        </div>

        <h1 className="titulo">CPCPR</h1>
        <p className="subtitulo">
          Sistema do Produtor Rural
        </p>

        {erro && (
          <div className="erro">
            <AlertCircle size={18} />
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="campo">

            <label>Usuário</label>

            <div className="input-box">

              <User size={18} className="icon" />

              <input
                type="text"
                placeholder="nome.usuario"
                value={form.nome}
                onChange={(e) =>
                  setForm({ ...form, nome: e.target.value })
                }
              />

            </div>

          </div>

          <div className="campo">

            <label>Senha</label>

            <div className="input-box">

              <Lock size={18} className="icon" />

              <input
                type={showSenha ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.senha}
                onChange={(e) =>
                  setForm({ ...form, senha: e.target.value })
                }
              />

              <button
                type="button"
                className="btn-eye"
                onClick={() => setShowSenha(!showSenha)}
              >
                {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

          </div>

          <button
            className="btn-login"
            type="submit"
            disabled={login.isPending}
          >

            <LogIn size={18} />

            {login.isPending ? 'Entrando...' : 'Entrar'}

          </button>

        </form>

      </div>

      <style jsx>{`

        .login-container{
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:linear-gradient(135deg,#0f172a,#1e3a8a);
          font-family:system-ui;
        }

        .login-box{
          width:360px;
          background:white;
          padding:36px;
          border-radius:14px;
          box-shadow:0 20px 40px rgba(0,0,0,0.25);
          animation:fade 0.4s ease;
        }

        @keyframes fade{
          from{
            opacity:0;
            transform:translateY(10px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        .logo{
          display:flex;
          justify-content:center;
          margin-bottom:10px;
          color:#1d4ed8;
        }

        .titulo{
          text-align:center;
          margin:0;
          font-size:26px;
          font-weight:700;
          color:#0f172a;
        }

        .subtitulo{
          text-align:center;
          font-size:14px;
          color:#64748b;
          margin-bottom:28px;
        }

        .campo{
          margin-bottom:18px;
        }

        label{
          font-size:13px;
          font-weight:600;
          color:#334155;
        }

        .input-box{
          margin-top:6px;
          display:flex;
          align-items:center;
          border:1px solid #cbd5e1;
          border-radius:8px;
          padding:10px;
          gap:8px;
          transition:all .2s;
        }

        .input-box:focus-within{
          border-color:#1d4ed8;
          box-shadow:0 0 0 2px rgba(29,78,216,0.15);
        }

        .icon{
          color:#64748b;
        }

        input{
          border:none;
          outline:none;
          flex:1;
          font-size:14px;
        }

        .btn-eye{
          border:none;
          background:none;
          cursor:pointer;
          color:#64748b;
          display:flex;
          align-items:center;
        }

        .btn-login{
          width:100%;
          margin-top:12px;
          padding:12px;
          border:none;
          border-radius:8px;
          background:#1d4ed8;
          color:white;
          font-weight:600;
          display:flex;
          justify-content:center;
          align-items:center;
          gap:8px;
          cursor:pointer;
          transition:all .2s;
        }

        .btn-login:hover{
          background:#1e40af;
        }

        .btn-login:disabled{
          opacity:0.6;
          cursor:not-allowed;
        }

        .erro{
          display:flex;
          align-items:center;
          gap:6px;
          background:#fee2e2;
          color:#991b1b;
          padding:10px;
          border-radius:8px;
          font-size:13px;
          margin-bottom:16px;
        }

      `}</style>
    </div>
  )
}