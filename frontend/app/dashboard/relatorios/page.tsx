// ═══════════════════════════════════════════════════
// RELATÓRIOS — relatorios/page.tsx
// ═══════════════════════════════════════════════════
'use client';

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { inscRenovApi } from '@/lib/api'
import type { InscRenov } from '@/types'

interface ResumoMunicipio {
  unloc: string
  inscricoes: number
  renovacoes: number
  total: number
  lancados: number
  pendentes: number
}

export default function RelatoriosPage() {

  const [filtro, setFiltro] = useState({
    unloc: '',
    dataInicio: '',
    dataFim: ''
  })

  const [aplicado, setAplicado] = useState({
    unloc: '',
    dataInicio: '',
    dataFim: ''
  })

  const q = useQuery<InscRenov[]>({
    queryKey: ['relatorio', aplicado],

    queryFn: async (): Promise<InscRenov[]> => {
      const res = await inscRenovApi.listar({
        unloc: aplicado.unloc || undefined,
        size: 9999
      })

      return res.data?.content ?? []
    },

    staleTime: 30000,
  })

  const todos: InscRenov[] = q.data ?? []

  const filtrados = todos.filter(r => {

    if (!r.datas) return true

    const data = new Date(r.datas)

    if (aplicado.dataInicio) {
      const ini = new Date(aplicado.dataInicio)
      if (data < ini) return false
    }

    if (aplicado.dataFim) {
      const fim = new Date(aplicado.dataFim)
      if (data > fim) return false
    }

    return true
  })

  const resumo: ResumoMunicipio[] = Object.values(

    filtrados.reduce<Record<string, ResumoMunicipio>>((acc, r) => {

      if (!acc[r.unloc]) {
        acc[r.unloc] = {
          unloc: r.unloc,
          inscricoes: 0,
          renovacoes: 0,
          total: 0,
          lancados: 0,
          pendentes: 0
        }
      }

      const g = acc[r.unloc]

      if (r.descricao === 'INSC') g.inscricoes++
      if (r.descricao === 'RENOV') g.renovacoes++

      g.total++

      if (r.lancou) g.lancados++
      else g.pendentes++

      return acc

    }, {})

  ).sort((a, b) => b.total - a.total)

  const totais = resumo.reduce((acc, r) => ({
    inscricoes: acc.inscricoes + r.inscricoes,
    renovacoes: acc.renovacoes + r.renovacoes,
    total: acc.total + r.total,
    lancados: acc.lancados + r.lancados,
    pendentes: acc.pendentes + r.pendentes
  }), {
    inscricoes: 0,
    renovacoes: 0,
    total: 0,
    lancados: 0,
    pendentes: 0
  })

  function dl(conteudo: string, nome: string, tipo: string) {
    const a = document.createElement('a')

    a.href = URL.createObjectURL(
      new Blob([conteudo], { type: tipo })
    )

    a.download = nome

    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  function exportarCSV() {

    if (!resumo.length) return

    const csv = [
      `# Relatório CPCPR — ${new Date().toLocaleString('pt-BR')}`,
      '',
      'UNLOC;Inscrições;Renovações;Total;Lançados;Pendentes;% Concluído',

      ...resumo.map(r => {

        const p = r.total
          ? Math.round((r.lancados / r.total) * 100)
          : 0

        return `${r.unloc};${r.inscricoes};${r.renovacoes};${r.total};${r.lancados};${r.pendentes};${p}%`
      }),

      '',
      `TOTAL GERAL;${totais.inscricoes};${totais.renovacoes};${totais.total};${totais.lancados};${totais.pendentes};${totais.total ? Math.round((totais.lancados/totais.total)*100) : 0}%`

    ].join('\n')

    dl(
      '\uFEFF' + csv,
      `relatorio_${new Date().toISOString().slice(0,10)}.csv`,
      'text/csv;charset=utf-8'
    )
  }

  function exportarTXT() {

    if (!resumo.length) return

    const c = (v: string | number, w: number) =>
      String(v).padEnd(w)

    const h =
      c('UNLOC',16) +
      c('INSCRIÇÕES',12) +
      c('RENOVAÇÕES',12) +
      c('TOTAL',10) +
      c('LANÇADOS',12) +
      c('PENDENTES',12) +
      'PROGRESSO'

    const linhas = resumo.map(r => {

      const p = r.total
        ? Math.round((r.lancados / r.total) * 100)
        : 0

      return (
        c(r.unloc,16) +
        c(r.inscricoes,12) +
        c(r.renovacoes,12) +
        c(r.total,10) +
        c(r.lancados,12) +
        c(r.pendentes,12) +
        `${p}%`
      )
    })

    const txt = [
      '='.repeat(88),
      'RELATÓRIO CPCPR',
      '='.repeat(88),
      `Gerado em : ${new Date().toLocaleString('pt-BR')}`,
      '',
      h,
      '-'.repeat(88),
      ...linhas,
      '-'.repeat(88)
    ].join('\n')

    dl(
      txt,
      `relatorio_${new Date().toISOString().slice(0,10)}.txt`,
      'text/plain;charset=utf-8'
    )
  }

  return (
    <div>...</div>
  )
}