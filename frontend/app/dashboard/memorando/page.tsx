'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { inscRenovApi, municipioApi } from '@/lib/api';
import { useAuthStore } from '@/lib/api';
import type { InscRenov, Municipio } from '@/types';

export default function MemorandoPage() {
  const usuario = useAuthStore((s) => s.usuario);

  const [form, setForm] = useState({
    nMemoSaida: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    nMemoEntrada: '',
    memorando: '',
  });

  const [queryMun, setQueryMun] = useState('');
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [showDrop, setShowDrop] = useState(false);
  const [munSelecionado, setMunSelecionado] = useState('');
  const [munNome, setMunNome] = useState('');

  function setField<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function buscarMunicipios(q: string) {
    setQueryMun(q);
    setMunSelecionado('');

    if (q.length < 1) {
      setMunicipios([]);
      return;
    }

    try {
      const r = await municipioApi.buscar(q);
      setMunicipios(r.data ?? []);
    } catch {
      setMunicipios([]);
    }
  }

  const podeBuscar =
    munSelecionado.length > 0 && form.memorando.trim().length > 0;

  const qProdutores = useQuery({
    queryKey: ['memo-produtores', munSelecionado, form.memorando],
    queryFn: async () => {
      const r = await inscRenovApi.listar({
        unloc: munSelecionado,
        memorando: form.memorando,
        size: 200,
      });

      return (r.data?.content ?? []) as InscRenov[];
    },
    enabled: podeBuscar,
  });

  const produtores = qProdutores.data ?? [];

  function gerarMemo() {
    if (!form.nMemoSaida.trim())
      return toast.error('Informe o nº do memorando de saída');

    if (!munSelecionado)
      return toast.error('Selecione um município');

    if (!form.memorando.trim())
      return toast.error('Informe o nº do memorando de entrada');

    if (!produtores.length)
      return toast.error(
        'Nenhum produtor encontrado para os filtros'
      );

    const dataFmt = new Date(form.dataEmissao).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    );

    const inscs = produtores.filter(
      (p) => p.descricao === 'INSC'
    );

    const renovs = produtores.filter(
      (p) => p.descricao === 'RENOV'
    );

    const linhaProdutor = (p: InscRenov, i: number) =>
      `  ${String(i + 1).padStart(2, '0')}. ${p.nome.padEnd(
        50
      )} CPF: ${p.cpf}`;

    const conteudo = [
      '='.repeat(70),
      `MEMORANDO Nº ${form.nMemoSaida}`,
      '='.repeat(70),
      '',
      `DATA DE EMISSÃO : ${dataFmt}`,
      `MUNICÍPIO       : ${munNome} (${munSelecionado})`,
      `MEMO ENTRADA    : ${form.nMemoEntrada || '—'}`,
      `EMITIDO POR     : ${usuario?.nome ?? '—'}`,
      '',
      '-'.repeat(70),
      `TOTAL DE REGISTROS : ${produtores.length}`,
      `  • Inscrições      : ${inscs.length}`,
      `  • Renovações      : ${renovs.length}`,
      '-'.repeat(70),
      '',
      ...(inscs.length
        ? ['INSCRIÇÕES:', ...inscs.map(linhaProdutor), '']
        : []),
      ...(renovs.length
        ? ['RENOVAÇÕES:', ...renovs.map(linhaProdutor), '']
        : []),
      '-'.repeat(70),
      'RELAÇÃO COMPLETA:',
      ...produtores.map(linhaProdutor),
      '',
      '='.repeat(70),
      `Documento gerado pelo sistema CPCPR em ${new Date().toLocaleString(
        'pt-BR'
      )}`,
      '='.repeat(70),
    ].join('\n');

    const blob = new Blob([conteudo], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `MEMO_${form.nMemoSaida.replace(
      /\//g,
      '-'
    )}_${munSelecionado}.txt`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    toast.success('Memorando gerado com sucesso!');
  }

  return (
    <div className="animate-fade-up">
      <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>
        Memorando
      </h2>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '24px',
        }}
      >
        Gere o memorando com a relação de produtores por
        município.
      </p>

      <button
        className="btn btn-primary"
        onClick={gerarMemo}
        disabled={
          !podeBuscar ||
          qProdutores.isLoading ||
          qProdutores.isFetching
        }
      >
        📄 Gerar Memorando
      </button>
    </div>
  );
}