'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { inscRenovApi } from '@/lib/api'
import type { InscRenov } from '@/types'

import TotalCard from '@/components/TotalCard/page'
import Skeleton from '@/components/Skeleton/page'
import Vazio from '@/components/Vazio/page'

interface ResumoUnloc {
  unloc: string
  inscricoes: number
  renovacoes: number
  total: number
  lancados: number
  pendentes: number
  urgentes: number
}

export default function AnaliseProcessosPage() {

  const [busca, setBusca] = useState('')

  const qTodos = useQuery({
    queryKey: ['analise-todos'],
    queryFn: async () => {
      const r = await inscRenovApi.listar()
      return (r?.data?.content ?? []) as InscRenov[]
    },
    staleTime: 60000
  })

  const todos = qTodos.data ?? []

  const resumo: ResumoUnloc[] = Object.values(
    todos.reduce<Record<string, ResumoUnloc>>((acc, r) => {

      const chave = r.unloc || 'SEM_UNLOC'

      if (!acc[chave]) {
        acc[chave] = {
          unloc: chave,
          inscricoes: 0,
          renovacoes: 0,
          total: 0,
          lancados: 0,
          pendentes: 0,
          urgentes: 0
        }
      }

      const g = acc[chave]

      if (r.descricao === 'INSC') g.inscricoes++
      if (r.descricao === 'RENOV') g.renovacoes++

      g.total++

      if (r.lancou) g.lancados++
      else g.pendentes++

      if (r.urgente) g.urgentes++

      return acc

    }, {})
  ).sort((a, b) => b.total - a.total)

  const filtrado = busca.trim()
    ? resumo.filter(r =>
        r.unloc.toLowerCase().includes(busca.toLowerCase())
      )
    : resumo

  const totais = resumo.reduce(
    (acc, r) => ({
      inscricoes: acc.inscricoes + r.inscricoes,
      renovacoes: acc.renovacoes + r.renovacoes,
      total: acc.total + r.total,
      lancados: acc.lancados + r.lancados,
      pendentes: acc.pendentes + r.pendentes,
      urgentes: acc.urgentes + r.urgentes
    }),
    {
      inscricoes: 0,
      renovacoes: 0,
      total: 0,
      lancados: 0,
      pendentes: 0,
      urgentes: 0
    }
  )

  return (

    <div className="animate-fade-up">

      <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>
        Análise de Processos
      </h2>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '24px'
        }}
      >
        Resumo de inscrições e renovações agrupados por município.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '28px'
        }}
      >

        <TotalCard label="Municípios" valor={resumo.length} cor="#a78bfa" icon="🗺️" loading={qTodos.isLoading}/>
        <TotalCard label="Inscrições" valor={totais.inscricoes} cor="#2FA572" icon="📄" loading={qTodos.isLoading}/>
        <TotalCard label="Renovações" valor={totais.renovacoes} cor="#4a9eff" icon="🔄" loading={qTodos.isLoading}/>
        <TotalCard label="Total" valor={totais.total} cor="#fff" icon="📊" loading={qTodos.isLoading}/>
        <TotalCard label="Lançados" valor={totais.lancados} cor="#2FA572" icon="✅" loading={qTodos.isLoading}/>
        <TotalCard label="Pendentes" valor={totais.pendentes} cor="#f5a623" icon="⏳" loading={qTodos.isLoading}/>
        <TotalCard label="Urgentes" valor={totais.urgentes} cor="#e05252" icon="🔴" loading={qTodos.isLoading}/>

      </div>

      <div style={{ marginBottom: '16px', maxWidth: '320px' }}>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="🔍 Filtrar por UNLOC..."
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        />
      </div>

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >

        {qTodos.isLoading && <Skeleton />}

        {!qTodos.isLoading && !filtrado.length && (
          <Vazio texto="Nenhum registro encontrado." />
        )}

        {!qTodos.isLoading && filtrado.length > 0 && (

          <div style={{ overflowX: 'auto' }}>

            <table className="tabela">

              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingLeft: '18px' }}>UNLOC</th>
                  <th>Inscrições</th>
                  <th>Renovações</th>
                  <th>Total</th>
                  <th>Lançados</th>
                  <th>Pendentes</th>
                  <th>Urgentes</th>
                  <th>Progresso</th>
                </tr>
              </thead>

              <tbody>

                {filtrado.map((r) => {

                  const pct = r.total
                    ? Math.round((r.lancados / r.total) * 100)
                    : 0

                  return (

                    <tr key={r.unloc}>

                      <td style={{ textAlign: 'left', paddingLeft: '18px' }}>
                        <span
                          style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: 700,
                            fontSize: '12px',
                            color: 'var(--green)'
                          }}
                        >
                          {r.unloc}
                        </span>
                      </td>

                      <td><span className="badge badge-insc">{r.inscricoes}</span></td>
                      <td><span className="badge badge-renov">{r.renovacoes}</span></td>
                      <td>{r.total}</td>
                      <td><span className="badge badge-ok">{r.lancados}</span></td>
                      <td>{r.pendentes || '—'}</td>
                      <td>{r.urgentes || '—'}</td>

                      <td style={{ minWidth: '120px' }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                          <div
                            style={{
                              flex: 1,
                              height: '6px',
                              borderRadius: '3px',
                              background: 'var(--bg-card2)',
                              overflow: 'hidden'
                            }}
                          >

                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                background:
                                  pct === 100
                                    ? 'var(--green)'
                                    : pct >= 50
                                    ? '#4a9eff'
                                    : '#f5a623'
                              }}
                            />

                          </div>

                          <span
                            style={{
                              fontSize: '10px',
                              fontFamily: 'JetBrains Mono, monospace',
                              color: 'var(--text-muted)'
                            }}
                          >
                            {pct}%
                          </span>

                        </div>

                      </td>

                    </tr>

                  )

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  )
}