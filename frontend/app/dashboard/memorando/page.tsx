// ═══════════════════════════════════════════════════
// MEMORANDO — memorando/page.tsx
// ═══════════════════════════════════════════════════
'use client';

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { inscRenovApi, municipioApi, useAuthStore } from '@/lib/api'
import type { InscRenov, Municipio } from '@/types'

export default function MemorandoPage() {

  const usuario = useAuthStore(s => s.usuario)

  const [form, setForm] = useState({
    nMemoSaida: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    nMemoEntrada: '',
    memorando: ''
  })

  const [queryMun, setQueryMun] = useState('')
  const [municipios, setMunicipios] = useState<Municipio[]>([])
  const [showDrop, setShowDrop] = useState(false)

  const [munSelecionado, setMunSelecionado] = useState('')
  const [munNome, setMunNome] = useState('')

  useEffect(() => {

    if (!queryMun.trim()) {
      setMunicipios([])
      return
    }

    const t = setTimeout(() => {
      municipioApi
        .buscar(queryMun)
        .then(r => setMunicipios(r.data ?? []))
        .catch(() => {})
    }, 250)

    return () => clearTimeout(t)

  }, [queryMun])

  const podeBuscar =
    munSelecionado.length > 0 &&
    form.memorando.trim().length > 0

  const qProdutores = useQuery<InscRenov[]>({
    queryKey: ['memo-produtores', munSelecionado, form.memorando],

    queryFn: async (): Promise<InscRenov[]> => {
      const res = await inscRenovApi.listar({
        unloc: munSelecionado,
        memorando: form.memorando,
        size: 200
      })

      return res.data?.content ?? []
    },

    enabled: podeBuscar,
  })

  const produtores: InscRenov[] = qProdutores.data ?? []

  function gerarMemo() {

    if (!form.nMemoSaida.trim())
      return toast.error('Informe o nº do memorando de saída')

    if (!munSelecionado)
      return toast.error('Selecione um município')

    if (!form.memorando.trim())
      return toast.error('Informe o nº do memorando de entrada')

    if (!produtores.length)
      return toast.error('Nenhum produtor encontrado')

    const dataFmt = new Date(form.dataEmissao)
      .toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })

    const inscs = produtores.filter(p => p.descricao === 'INSC')
    const renovs = produtores.filter(p => p.descricao === 'RENOV')

    const linha = (p: InscRenov, i: number) =>
      `  ${String(i + 1).padStart(2, '0')}. ${p.nome.padEnd(50)} CPF: ${p.cpf}`

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
      `  • Inscrições  : ${inscs.length}`,
      `  • Renovações  : ${renovs.length}`,
      '-'.repeat(70),
      '',
      ...(inscs.length ? ['INSCRIÇÕES:', ...inscs.map(linha), ''] : []),
      ...(renovs.length ? ['RENOVAÇÕES:', ...renovs.map(linha), ''] : []),
      '='.repeat(70),
      `Gerado pelo CPCPR em ${new Date().toLocaleString('pt-BR')}`,
      '='.repeat(70),
    ].join('\n')

    const blob = new Blob([conteudo], {
      type: 'text/plain;charset=utf-8'
    })

    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)

    a.download =
      `MEMO_${form.nMemoSaida.replace(/\//g, '-')}_${munSelecionado}.txt`

    document.body.appendChild(a)
    a.click()
    a.remove()

    toast.success('Memorando gerado!')
  }

  return (
    <>
      <style>{`
        .memo-layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 20px;
        }

        @media (max-width: 850px) {
          .memo-layout {
            grid-template-columns: 1fr;
          }
        }

        .memo-form {
          background: var(--bg-card);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: var(--shadow-sm);
        }

        .memo-campo {
          margin-bottom: 14px;
        }

        .memo-drop {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 60;
          background: var(--bg-card);
          border: 1.5px solid var(--gov-green);
          border-radius: var(--radius-sm);
          max-height: 200px;
          overflow-y: auto;
          box-shadow: var(--shadow-md);
        }

        .memo-drop-item {
          padding: 9px 14px;
          cursor: pointer;
          display: flex;
          gap: 10px;
          font-size: 13px;
        }

        .memo-drop-item:hover {
          background: var(--bg);
        }
      `}</style>

      <div className="animate-fade-up">

        <div className="page-header">
          <div>
            <h2 className="page-titulo">Memorando</h2>
            <p className="page-subtitulo">
              Gere o memorando com a relação de produtores por município.
            </p>
          </div>
        </div>

        {/* resto da interface permanece igual */}
      </div>
    </>
  )
}