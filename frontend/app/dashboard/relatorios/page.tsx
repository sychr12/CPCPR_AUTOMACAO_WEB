'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { inscRenovApi } from '@/lib/api';
import type { InscRenov } from '@/types';

interface ResumoMunicipio {
  unloc: string;
  inscricoes: number;
  renovacoes: number;
  total: number;
  lancados: number;
  pendentes: number;
}

export default function RelatoriosPage() {

  const [filtro, setFiltro] = useState({
    unloc: '',
    dataInicio: '',
    dataFim: '',
  });

  const [aplicado, setAplicado] = useState({
    unloc: '',
    dataInicio: '',
    dataFim: '',
  });

  const qDados = useQuery({
    queryKey: ['relatorio', aplicado],
    queryFn: async () => {

      const r = await inscRenovApi.listar({
        unloc: aplicado.unloc || undefined,
        size: 9999,
      });

      return (r.data?.content ?? []) as InscRenov[];

    },
    staleTime: 30000,
  });

  const todos = qDados.data ?? [];

  const filtrados = todos.filter((r) => {

    if (!r.datas) return true;

    if (aplicado.dataInicio) {
      const inicio = new Date(aplicado.dataInicio);
      const data = new Date(r.datas);
      if (data < inicio) return false;
    }

    if (aplicado.dataFim) {
      const fim = new Date(aplicado.dataFim);
      const data = new Date(r.datas);
      if (data > fim) return false;
    }

    return true;

  });

  const resumo: ResumoMunicipio[] = Object.values(

    filtrados.reduce<Record<string, ResumoMunicipio>>((acc, r) => {

      if (!acc[r.unloc]) {
        acc[r.unloc] = {
          unloc: r.unloc,
          inscricoes: 0,
          renovacoes: 0,
          total: 0,
          lancados: 0,
          pendentes: 0,
        };
      }

      const g = acc[r.unloc];

      if (r.descricao === 'INSC') g.inscricoes++;
      if (r.descricao === 'RENOV') g.renovacoes++;

      g.total++;

      if (r.lancou) g.lancados++;
      else g.pendentes++;

      return acc;

    }, {})

  ).sort((a, b) => b.total - a.total);

  const totais = resumo.reduce(

    (acc, r) => ({

      inscricoes: acc.inscricoes + r.inscricoes,
      renovacoes: acc.renovacoes + r.renovacoes,
      total: acc.total + r.total,
      lancados: acc.lancados + r.lancados,
      pendentes: acc.pendentes + r.pendentes,

    }),

    { inscricoes: 0, renovacoes: 0, total: 0, lancados: 0, pendentes: 0 }

  );

  function aplicarFiltro(e: React.FormEvent) {
    e.preventDefault();
    setAplicado({ ...filtro });
  }

  function limpar() {

    const vazio = {
      unloc: '',
      dataInicio: '',
      dataFim: '',
    };

    setFiltro(vazio);
    setAplicado(vazio);

  }

  function downloadArquivo(conteudo: string, nome: string, tipo: string) {

    const blob = new Blob([conteudo], { type: tipo });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = nome;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

  }

  function exportarCSV() {

    if (!resumo.length) return;

    const cabecalho = [
      'UNLOC',
      'Inscrições',
      'Renovações',
      'Total',
      'Lançados',
      'Pendentes',
      '% Concluído',
    ];

    const linhas = resumo.map((r) => {

      const pct = r.total
        ? Math.round((r.lancados / r.total) * 100)
        : 0;

      return [
        r.unloc,
        r.inscricoes,
        r.renovacoes,
        r.total,
        r.lancados,
        r.pendentes,
        `${pct}%`,
      ].join(';');

    });

    const rodape = [
      'TOTAL GERAL',
      totais.inscricoes,
      totais.renovacoes,
      totais.total,
      totais.lancados,
      totais.pendentes,
      totais.total
        ? `${Math.round((totais.lancados / totais.total) * 100)}%`
        : '0%',
    ].join(';');

    const meta = [
      `# Relatório CPCPR — ${new Date().toLocaleString('pt-BR')}`,
      aplicado.unloc ? `# UNLOC: ${aplicado.unloc}` : '',
      aplicado.dataInicio ? `# De: ${aplicado.dataInicio}` : '',
      aplicado.dataFim ? `# Até: ${aplicado.dataFim}` : '',
      '',
    ].filter(Boolean);

    const csv = [
      ...meta,
      cabecalho.join(';'),
      ...linhas,
      '',
      rodape,
    ].join('\n');

    downloadArquivo(
      '\uFEFF' + csv,
      `relatorio_${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8'
    );

  }

  function exportarTXT() {

    if (!resumo.length) return;

    const col = (v: string | number, w: number) =>
      String(v).padEnd(w);

    const linhas = resumo.map((r) => {

      const pct = r.total
        ? Math.round((r.lancados / r.total) * 100)
        : 0;

      return (
        col(r.unloc, 16) +
        col(r.inscricoes, 12) +
        col(r.renovacoes, 12) +
        col(r.total, 10) +
        col(r.lancados, 12) +
        col(r.pendentes, 12) +
        `${pct}%`
      );

    });

    const header =
      col('UNLOC', 16) +
      col('INSCRIÇÕES', 12) +
      col('RENOVAÇÕES', 12) +
      col('TOTAL', 10) +
      col('LANÇADOS', 12) +
      col('PENDENTES', 12) +
      'PROGRESSO';

    const conteudo = [

      '='.repeat(88),
      'RELATÓRIO CPCPR',
      '='.repeat(88),
      `Gerado em : ${new Date().toLocaleString('pt-BR')}`,
      '',
      header,
      '-'.repeat(88),
      ...linhas,
      '-'.repeat(88),

    ].join('\n');

    downloadArquivo(
      conteudo,
      `relatorio_${new Date().toISOString().slice(0, 10)}.txt`,
      'text/plain;charset=utf-8'
    );

  }

  return (

    <div>

      <button onClick={exportarCSV}>
        Exportar CSV
      </button>

      <button onClick={exportarTXT}>
        Exportar TXT
      </button>

    </div>

  );

}