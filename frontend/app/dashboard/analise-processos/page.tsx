'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  Map,
  FileText,
  RefreshCcw,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Inbox
} from "lucide-react";

import { inscRenovApi } from '@/lib/api';
import type { InscRenov } from '@/types';

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

  const q = useQuery<InscRenov[]>({
    queryKey: ['analise-todos'],
    queryFn: async (): Promise<InscRenov[]> => {
      const res = await inscRenovApi.listar()
      return res.data?.content ?? []
    },
    staleTime: 60000,
  })

  const todos: InscRenov[] = q.data ?? []

  const resumo: ResumoUnloc[] = Object.values(
    todos.reduce<Record<string, ResumoUnloc>>((acc, r) => {

      const k = r.unloc || 'SEM_UNLOC'

      if (!acc[k]) {
        acc[k] = {
          unloc: k,
          inscricoes: 0,
          renovacoes: 0,
          total: 0,
          lancados: 0,
          pendentes: 0,
          urgentes: 0,
        }
      }

      const g = acc[k]

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

  const totais = resumo.reduce((acc, r) => ({
    inscricoes: acc.inscricoes + r.inscricoes,
    renovacoes: acc.renovacoes + r.renovacoes,
    total: acc.total + r.total,
    lancados: acc.lancados + r.lancados,
    pendentes: acc.pendentes + r.pendentes,
    urgentes: acc.urgentes + r.urgentes,
  }), {
    inscricoes: 0,
    renovacoes: 0,
    total: 0,
    lancados: 0,
    pendentes: 0,
    urgentes: 0
  })

  const cardsResumo = [
    { label: 'Municípios', valor: resumo.length, cor: '#7c3aed', icon: Map },
    { label: 'Inscrições', valor: totais.inscricoes, cor: 'var(--gov-green)', icon: FileText },
    { label: 'Renovações', valor: totais.renovacoes, cor: 'var(--gov-blue-light)', icon: RefreshCcw },
    { label: 'Total', valor: totais.total, cor: 'var(--gov-navy)', icon: BarChart3 },
    { label: 'Lançados', valor: totais.lancados, cor: 'var(--gov-green)', icon: CheckCircle },
    { label: 'Pendentes', valor: totais.pendentes, cor: '#d97706', icon: Clock },
    { label: 'Urgentes', valor: totais.urgentes, cor: 'var(--gov-red)', icon: AlertCircle },
  ]

  return (
    <div className="animate-fade-up">

      <div className="page-header">

        <div>

          <h2 className="page-titulo">
            <BarChart3 size={20} style={{ marginRight: 8 }} />
            Análise de Processos
          </h2>

          <p className="page-subtitulo">
            Resumo agrupado por município — inscrições e renovações.
          </p>

        </div>

      </div>

      {/* CARDS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
          gap: 12,
          marginBottom: 28
        }}
      >

        {cardsResumo.map(c => {

          const Icon = c.icon

          return (

            <div
              key={c.label}
              style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 16,
                borderTop: `3px solid ${c.cor}`
              }}
            >

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10
                }}
              >

                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)'
                  }}
                >
                  {c.label}
                </span>

                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: c.cor + '15',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={16} color={c.cor} />
                </div>

              </div>

              {q.isLoading
                ? <div style={{ height: 30, background: 'var(--bg)', borderRadius: 4 }} />
                : <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: c.cor
                  }}
                >
                  {c.valor.toLocaleString('pt-BR')}
                </div>
              }

            </div>

          )

        })}

      </div>

      {/* BUSCA */}

      <div style={{ maxWidth: 320, marginBottom: 16, position: 'relative' }}>

        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 10,
            top: 10,
            color: '#64748b'
          }}
        />

        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Filtrar por UNLOC..."
          style={{ paddingLeft: 32 }}
        />

      </div>

      {/* TABELA */}

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden'
        }}
      >

        {q.isLoading ? (

          <div style={{ padding: 32, textAlign: 'center' }}>
            Carregando...
          </div>

        ) : !filtrado.length ? (

          <div style={{ padding: 48, textAlign: 'center' }}>

            <Inbox size={32} color="#94a3b8" />

            <p style={{ marginTop: 8 }}>
              Nenhum registro encontrado
            </p>

          </div>

        ) : (

          <div style={{ overflowX: 'auto' }}>

            <table className="tabela">

              <thead>
                <tr>
                  <th>UNLOC</th>
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

                {filtrado.map(r => {

                  const pct = r.total
                    ? Math.round((r.lancados / r.total) * 100)
                    : 0

                  const cor =
                    pct === 100
                      ? 'var(--gov-green)'
                      : pct >= 50
                        ? 'var(--gov-blue-light)'
                        : '#d97706'

                  return (

                    <tr key={r.unloc}>

                      <td>{r.unloc}</td>
                      <td>{r.inscricoes}</td>
                      <td>{r.renovacoes}</td>
                      <td style={{ fontWeight: 700 }}>
                        {r.total}
                      </td>
                      <td>{r.lancados}</td>
                      <td>{r.pendentes || '—'}</td>
                      <td>{r.urgentes || '—'}</td>

                      <td style={{ minWidth: 140 }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                          <div
                            style={{
                              flex: 1,
                              height: 5,
                              borderRadius: 3,
                              background: '#e5e7eb',
                              overflow: 'hidden'
                            }}
                          >

                            <div
                              style={{
                                width: pct + '%',
                                background: cor,
                                height: '100%'
                              }}
                            />

                          </div>

                          <span style={{ fontSize: 11, minWidth: 32 }}>
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