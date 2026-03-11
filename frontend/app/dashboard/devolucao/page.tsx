'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { devApi, municipioApi, useAuthStore } from '@/lib/api'  // ← authStore corrigido
import type { Dev, Municipio } from '@/types'

export default function DevolucaoPage() {

  const usuario = useAuthStore((s) => s.usuario)
  const qc = useQueryClient()

  const [memorando, setMemorando] = useState('')
  const [munSelecionado, setMunSelecionado] = useState('')
  const [munNome, setMunNome] = useState('')
  const [queryMun, setQueryMun] = useState('')
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [showDrop, setShowDrop] = useState(false)

  const munRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (munRef.current && !munRef.current.contains(e.target as Node)) {
        setShowDrop(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (queryMun.trim().length < 1) {
      setMunicipios([])
      return
    }
    const t = setTimeout(() => {
      municipioApi
        .buscar(queryMun)
        .then((r) => setMunicipios(r.data))
        .catch(() => {})
    }, 250)
    return () => clearTimeout(t)
  }, [queryMun])

  const podeBuscar = munSelecionado.length > 0 && memorando.trim().length > 0

  const qPendentes = useQuery({
    queryKey: ['dev-pendentes', munSelecionado, memorando],
    queryFn: () =>
      devApi
        .pendentes()                           // ← sem argumentos
        .then((r) =>
          // filtra no cliente por unloc + memorando
          (r.data as Dev[]).filter(
            (d) => d.unloc === munSelecionado && d.memorando === memorando
          )
        ),
    enabled: podeBuscar,
  })

  const pendentes = qPendentes.data ?? []

  const marcar = useMutation({
    mutationFn: () =>
      devApi.marcarEnvio({                     // ← marcarEnvio com objeto
        unloc: munSelecionado,
        memorando,
      }),
    onSuccess: () => {
      toast.success('Devoluções marcadas como enviadas!')
      qc.invalidateQueries({ queryKey: ['dev-pendentes'] })
      qc.invalidateQueries({ queryKey: ['dev'] })
    },
    onError: () => toast.error('Erro ao marcar como enviado'),
  })

  function gerarDocumento() {
    if (!pendentes.length) {
      toast.error('Nenhuma devolução encontrada')
      return
    }

    const dataFmt = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    })

    const linhaProdutor = (d: Dev, i: number) =>
      [
        `  ${String(i + 1).padStart(2, '0')}. ${d.nome.padEnd(48)} CPF: ${d.cpf}`,
        `      Motivo: ${d.motivo}`,
        '',
      ].join('\n')

    const conteudo = [
      '='.repeat(70),
      'RELAÇÃO DE DEVOLUÇÕES',
      '='.repeat(70),
      '',
      `DATA            : ${dataFmt}`,
      `MUNICÍPIO       : ${munNome} (${munSelecionado})`,
      `MEMORANDO       : ${memorando}`,
      `GERADO POR      : ${usuario?.nome ?? '—'}`,
      '',
      '-'.repeat(70),
      `TOTAL DE DEVOLUÇÕES : ${pendentes.length}`,
      '-'.repeat(70),
      '',
      ...pendentes.map(linhaProdutor),
      '='.repeat(70),
      `Documento gerado pelo sistema CPCPR em ${new Date().toLocaleString('pt-BR')}`,
      '='.repeat(70),
    ].join('\n')

    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `DEV_${munSelecionado}_${memorando.replace(/\//g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Documento gerado!')
  }

  return (
    <div className="animate-fade-up">

      <h2 style={{ fontSize: 20, marginBottom: 4 }}>Devolução</h2>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        Consulte devoluções pendentes, gere documento e marque como enviado.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>

        {/* COLUNA ESQUERDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 20,
          }}>

            <p className="section-title" style={{ marginBottom: 16 }}>
              Filtrar Devoluções
            </p>

            <div ref={munRef} style={{ marginBottom: 14, position: 'relative' }}>
              <label style={lbl}>Município</label>
              <input
                value={queryMun}
                onChange={(e) => {
                  setQueryMun(e.target.value)
                  setMunSelecionado('')
                  setShowDrop(true)
                }}
                onFocus={() => setShowDrop(true)}
                placeholder="Buscar município..."
              />
              {showDrop && municipios.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  background: 'var(--bg-card2)', border: '1px solid var(--green)',
                  borderRadius: 8, maxHeight: 180, overflowY: 'auto', zIndex: 50,
                }}>
                  {municipios.map((m) => (
                    <div
                      key={m.codigo}
                      onClick={() => {
                        setMunSelecionado(m.codigo)
                        setMunNome(m.nome)
                        setQueryMun(m.nome)
                        setShowDrop(false)
                      }}
                      style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', gap: 10 }}
                    >
                      <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--green)', minWidth: 60 }}>
                        {m.codigo}
                      </span>
                      <span>{m.nome}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label style={lbl}>Memorando</label>
              <input
                value={memorando}
                onChange={(e) => setMemorando(e.target.value)}
                placeholder="nº memorando"
              />
            </div>

          </div>

          {pendentes.length > 0 && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <button className="btn btn-primary" onClick={gerarDocumento}>
                📄 Gerar Documento (.txt)
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => marcar.mutate()}
                disabled={marcar.isPending}
              >
                {marcar.isPending ? 'Marcando...' : 'Marcar como Enviado'}
              </button>
            </div>
          )}

        </div>

        {/* COLUNA DIREITA */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12, overflow: 'hidden',
        }}>
          {!podeBuscar ? (
            <Placeholder texto="Informe município e memorando para buscar." />
          ) : qPendentes.isLoading ? (
            <Skeleton />
          ) : !pendentes.length ? (
            <Placeholder texto="Nenhuma devolução encontrada." icone="✅" />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tabela">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Motivo</th>
                    <th>Analista</th>
                  </tr>
                </thead>
                <tbody>
                  {pendentes.map((d, i) => (
                    <tr key={d.id}>
                      <td>{i + 1}</td>
                      <td>{d.nome}</td>
                      <td>{d.cpf}</td>
                      <td>{d.motivo}</td>
                      <td>{d.analise ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function Placeholder({ texto, icone = '↩️' }: { texto: string; icone?: string }) {
  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: 32 }}>{icone}</div>
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{texto}</p>
    </div>
  )
}

function Skeleton() {
  return <div style={{ padding: 20 }}>carregando...</div>
}

const lbl: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontFamily: 'JetBrains Mono, monospace',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: 5,
}