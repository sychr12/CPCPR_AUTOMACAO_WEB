'use client'

import React, { useState, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { inscRenovApi, devApi } from "@/lib/api" 
import type { InscRenov, Dev, FiltroConsulta } from '@/types'

type Aba = 'inscrenov' | 'dev'

export default function ConsultaPage() {
  const [aba, setAba] = useState<Aba>('inscrenov')
  const [pagina, setPagina] = useState(0)
  const [filtro, setFiltro] = useState<FiltroConsulta>({})
  const [editando, setEditando] = useState<InscRenov | Dev | null>(null)
  const [confirmDel, setConfirmDel] = useState<number | null>(null)

  const qc = useQueryClient()

  const qInsc = useQuery({
    queryKey: ['inscrenov', filtro, pagina],
    queryFn: () =>
      inscRenovApi
        .listar({ ...filtro, page: pagina, size: 20 })
        .then((r: any) => r.data),
    enabled: aba === 'inscrenov',
  })

  const qDev = useQuery({
    queryKey: ['dev', filtro, pagina],
    queryFn: () =>
      devApi
        .listar({ ...filtro, page: pagina, size: 20 })
        .then((r: any) => r.data),
    enabled: aba === 'dev',
  })

  const delInsc = useMutation({
    mutationFn: (id: number) => inscRenovApi.deletar(id),
    onSuccess: () => {
      toast.success('Registro excluído')
      qc.invalidateQueries({ queryKey: ['inscrenov'] })
      setConfirmDel(null)
    },
    onError: () => toast.error('Erro ao excluir'),
  })

  const delDev = useMutation({
    mutationFn: (id: number) => devApi.deletar(id),
    onSuccess: () => {
      toast.success('Devolução excluída')
      qc.invalidateQueries({ queryKey: ['dev'] })
      setConfirmDel(null)
    },
    onError: () => toast.error('Erro ao excluir'),
  })

  const data = aba === 'inscrenov' ? qInsc.data : qDev.data
  const isLoading = aba === 'inscrenov' ? qInsc.isLoading : qDev.isLoading

  const totalPages = data?.totalPages ?? 0
  const total = data?.totalElements ?? 0

  function aplicarFiltro(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setFiltro({
      nome:      (fd.get('nome') as string)      || undefined,
      cpf:       (fd.get('cpf') as string)       || undefined,
      unloc:     (fd.get('unloc') as string)     || undefined,
      memorando: (fd.get('memorando') as string) || undefined,  // ← chave correta do tipo
      descricao: (fd.get('descricao') as string) || undefined,
    })
    setPagina(0)
  }

  function limparFiltro() {
    setFiltro({})
    setPagina(0)
  }

  function confirmarDel(id: number) {
    if (aba === 'inscrenov') delInsc.mutate(id)
    else delDev.mutate(id)
  }

  return (
    <div className="animate-fade-up">

      <h2 style={{ fontSize: 20, marginBottom: 4 }}>
        Consulta de Dados
      </h2>

      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        Pesquise, edite ou exclua registros do sistema.
      </p>

      {/* ABAS */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 20,
        borderBottom: '1px solid var(--border)',
      }}>
        {(['inscrenov', 'dev'] as Aba[]).map((a) => (
          <button
            key={a}
            onClick={() => { setAba(a); setPagina(0); setFiltro({}) }}
            style={{
              background: aba === a ? 'var(--bg-card2)' : 'transparent',
              border: `1px solid ${aba === a ? 'var(--green)' : 'transparent'}`,
              borderBottom: aba === a ? '1px solid var(--bg-card2)' : 'none',
              color: aba === a ? '#fff' : 'var(--text-muted)',
              padding: '8px 20px',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: aba === a ? 700 : 400,
            }}
          >
            {a === 'inscrenov' ? '📄 Inscrições / Renovações' : '↩️ Devoluções'}
          </button>
        ))}
      </div>

      {/* FILTROS */}
      <form
        onSubmit={aplicarFiltro}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}
      >
        {['nome', 'cpf', 'unloc', 'memorando', 'descricao'].map((campo) => (
          <input
            key={campo}
            name={campo}
            placeholder={campo.charAt(0).toUpperCase() + campo.slice(1)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: '#fff',
              fontSize: 12,
              minWidth: 120,
            }}
          />
        ))}
        <button type="submit" className="btn btn-primary" style={{ fontSize: 12 }}>
          Buscar
        </button>
        <button type="button" onClick={limparFiltro} className="btn" style={{ fontSize: 12 }}>
          Limpar
        </button>
      </form>

      {/* CONTADOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {isLoading ? '...' : `${total.toLocaleString('pt-BR')} registro(s) encontrado(s)`}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          Página {pagina + 1} / {Math.max(totalPages, 1)}
        </span>
      </div>

      {/* TABELA */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          {isLoading ? (
            <TabelaSkeleton colunas={8} />
          ) : !data?.content?.length ? (
            <Vazio />
          ) : aba === 'inscrenov' ? (
            <TabelaInscRenov
              rows={data.content as InscRenov[]}
              onEditar={(row: InscRenov) => setEditando(row)}
              onDeletar={(id: number) => setConfirmDel(id)}
            />
          ) : (
            <TabelaDev
              rows={data.content as Dev[]}
              onEditar={(row: Dev) => setEditando(row)}
              onDeletar={(id: number) => setConfirmDel(id)}
            />
          )}
        </div>
      </div>

      {/* PAGINAÇÃO */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <button
            className="btn"
            onClick={() => setPagina(p => Math.max(0, p - 1))}
            disabled={pagina === 0}
            style={{ fontSize: 12 }}
          >
            ← Anterior
          </button>
          <button
            className="btn"
            onClick={() => setPagina(p => Math.min(totalPages - 1, p + 1))}
            disabled={pagina >= totalPages - 1}
            style={{ fontSize: 12 }}
          >
            Próxima →
          </button>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO */}
      {confirmDel !== null && (
        <Modal onClose={() => setConfirmDel(null)}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40 }}>🗑️</div>
            <h3>Confirmar exclusão</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              Essa ação não pode ser desfeita.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button className="btn" onClick={() => setConfirmDel(null)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={() => confirmarDel(confirmDel)}>
                Excluir
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ── COMPONENTES LOCAIS ─────────────────────────────────────────── */

function Modal({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 200,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          padding: 24,
          borderRadius: 12,
          minWidth: 280,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function TabelaSkeleton({ colunas }: { colunas: number }) {
  return (
    <table className="tabela">
      <thead>
        <tr>{Array.from({ length: colunas }).map((_, i) => <th key={i}> </th>)}</tr>
      </thead>
      <tbody>
        {Array.from({ length: 8 }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: colunas }).map((_, j) => <td key={j}>...</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Vazio() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 32 }}>📭</div>
      <p style={{ color: 'var(--text-muted)' }}>Nenhum registro encontrado</p>
    </div>
  )
}

// ── Componentes de tabela inline (evita problema de props) ────────

function TabelaInscRenov({
  rows,
  onEditar,
  onDeletar,
}: {
  rows: InscRenov[]
  onEditar: (row: InscRenov) => void
  onDeletar: (id: number) => void
}) {
  return (
    <table className="tabela" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Nome','CPF','UNLOC','Memorando','Tipo','Datas','Análise','Ações'].map(h => (
            <th key={h} style={{ padding: '10px 12px', fontSize: 11, textAlign: 'left',
              borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.nome}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.cpf}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.unloc}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.memorando}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: 11,
                background: row.descricao === 'INSC' ? '#1a4a2e' : '#1a2a4a',
                color: row.descricao === 'INSC' ? '#2FA572' : '#4a9eff',
              }}>
                {row.descricao}
              </span>
            </td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.datas}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.analise}</td>
            <td style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => onEditar(row)}
                  style={{ padding: '4px 10px', borderRadius: 4, fontSize: 11,
                    background: 'var(--bg-card2)', border: '1px solid var(--border)',
                    color: '#fff', cursor: 'pointer' }}>
                  ✏️
                </button>
                <button onClick={() => onDeletar(row.id)}
                  style={{ padding: '4px 10px', borderRadius: 4, fontSize: 11,
                    background: '#3a1a1a', border: '1px solid #ff4444',
                    color: '#ff4444', cursor: 'pointer' }}>
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TabelaDev({
  rows,
  onEditar,
  onDeletar,
}: {
  rows: Dev[]
  onEditar: (row: Dev) => void
  onDeletar: (id: number) => void
}) {
  return (
    <table className="tabela" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {['Nome','CPF','UNLOC','Memorando','Motivo','Envio','Ações'].map(h => (
            <th key={h} style={{ padding: '10px 12px', fontSize: 11, textAlign: 'left',
              borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.nome}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.cpf}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.unloc}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.memorando}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>{row.motivo}</td>
            <td style={{ padding: '10px 12px', fontSize: 13 }}>
              {row.envio
                ? <span style={{ color: '#2FA572' }}>✅ {row.envio}</span>
                : <span style={{ color: '#f59e0b' }}>⏳ Pendente</span>
              }
            </td>
            <td style={{ padding: '10px 12px' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => onEditar(row)}
                  style={{ padding: '4px 10px', borderRadius: 4, fontSize: 11,
                    background: 'var(--bg-card2)', border: '1px solid var(--border)',
                    color: '#fff', cursor: 'pointer' }}>
                  ✏️
                </button>
                <button onClick={() => onDeletar(row.id)}
                  style={{ padding: '4px 10px', borderRadius: 4, fontSize: 11,
                    background: '#3a1a1a', border: '1px solid #ff4444',
                    color: '#ff4444', cursor: 'pointer' }}>
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}