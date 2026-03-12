'use client'

import { useQuery } from '@tanstack/react-query'
import { inscRenovApi } from '@/lib/api'
import type { InscRenov } from '@/types'

import {
  Paperclip,
  Wrench,
  FileText,
  Link2,
  Loader2
} from 'lucide-react'

export default function AnexarPage() {

  const { data = [], isLoading } = useQuery<InscRenov[]>({
    queryKey: ['processos-anexar'],
    queryFn: async () => {
      const res = await inscRenovApi.listar({ size: 50 })
      return res.data?.content ?? []
    }
  })

  return (
    <div className="animate-fade-up">

      {/* HEADER */}

      <div className="page-header">
        <div>

          <h2 className="page-titulo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Paperclip size={20} />
            Anexar Documentos
          </h2>

          <p className="page-subtitulo">
            Automação de anexação nos sistemas SIGED e SEFA.
          </p>

        </div>
      </div>


      {/* AVISO */}

      <div
        style={{
          display: 'flex',
          gap: 16,
          padding: '18px 20px',
          background: 'var(--gov-gold-bg)',
          border: '1.5px solid rgba(255,210,0,0.35)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 24
        }}
      >

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: 'rgba(255,210,0,0.15)',
            border: '1px solid rgba(255,210,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Wrench size={18} color="#b45309" />
        </div>

        <div>

          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#92400e',
              marginBottom: 4
            }}
          >
            Automação em Desenvolvimento
          </div>

          <p
            style={{
              fontSize: 13,
              color: '#92400e',
              lineHeight: 1.6
            }}
          >
            A integração com SIGED e SEFA está sendo implementada via Selenium.
            Configure o <code>SeleniumService.java</code> no backend para ativar.
          </p>

        </div>

      </div>


      {/* LOADING */}

      {isLoading ? (

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            padding: 32,
            color: '#64748b'
          }}
        >
          <Loader2 size={18} className="spin" />
          Carregando processos...
        </div>

      ) : (

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
            gap: 16
          }}
        >

          {data.map((proc: InscRenov) => (

            <div
              key={proc.id}
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 20,
                boxShadow: 'var(--shadow-sm)'
              }}
            >

              {/* HEADER CARD */}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: 16
                }}
              >

                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    background: 'var(--gov-green-bg)',
                    border: '1px solid rgba(0,156,70,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FileText size={18} color="var(--gov-green)" />
                </div>

                <div>

                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 14
                    }}
                  >
                    {proc.nome}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      marginTop: 2,
                      display: 'flex',
                      gap: 6,
                      alignItems: 'center'
                    }}
                  >

                    <span
                      className={
                        proc.descricao === 'INSC'
                          ? 'badge badge-insc'
                          : 'badge badge-renov'
                      }
                    >
                      {proc.descricao}
                    </span>

                    <span
                      style={{
                        fontSize: 11,
                        color: 'var(--gov-green)',
                        fontWeight: 700
                      }}
                    >
                      {proc.unloc}
                    </span>

                  </div>

                </div>

              </div>


              {/* BOTÕES */}

              <div style={{ display: 'flex', gap: 8 }}>

                <button
                  className="btn-primary btn"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => alert('SIGED: automação em desenvolvimento')}
                >
                  <Paperclip size={14} />
                  Anexar SIGED
                </button>

                <button
                  className="btn-secondary btn"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => alert('SEFA: automação em desenvolvimento')}
                >
                  <Link2 size={14} />
                  Anexar SEFA
                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      <style>{`

      .spin {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      `}</style>

    </div>
  )
}