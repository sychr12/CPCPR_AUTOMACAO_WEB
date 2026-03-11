'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { inscRenovApi } from '@/lib/api';
import type { InscRenov } from '@/types';

// ── componente principal ──────────────────────────────────────
export default function LancamentoProcessoPage() {

  const [cpfBusca, setCpfBusca] = useState('');
  const [cpfAtivo, setCpfAtivo] = useState('');
  const [paginaPend, setPaginaPend] = useState(0);

  const qc = useQueryClient();

  // ── pendentes ───────────────────────────────────────────────
  const qPendentes = useQuery({
    queryKey: ['inscrenov-pendentes', paginaPend],

    queryFn: () =>
      inscRenovApi
        .listar({ lancou: 'pendente', page: paginaPend, size: 15 })
        .then((r) => r.data),

  });

  // ── busca CPF ───────────────────────────────────────────────
  const qCpf = useQuery({
    queryKey: ['inscrenov-cpf', cpfAtivo],

    queryFn: () =>
      inscRenovApi
        .buscarPorCpf(cpfAtivo)
        .then((r) => r.data as InscRenov[]),

    enabled: cpfAtivo.length === 14,
  });

  // ── mutation lançar ─────────────────────────────────────────
  const lancar = useMutation({

    mutationFn: (id: number) =>
      inscRenovApi.lancar(id),

    onSuccess: () => {

      toast.success('Processo lançado com sucesso!');

      qc.invalidateQueries({ queryKey: ['inscrenov-pendentes'] });
      qc.invalidateQueries({ queryKey: ['inscrenov-cpf'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });

    },

    onError: () => {
      toast.error('Erro ao lançar processo');
    }

  });

  // ── helpers ─────────────────────────────────────────────────
  function formatarCPF(v: string) {

    const d = v.replace(/\D/g, '').slice(0, 11);

    return d
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  }

  function buscarCpf() {

    if (cpfBusca.length < 14) {
      toast.error('Digite um CPF válido');
      return;
    }

    setCpfAtivo(cpfBusca);

  }

  const pendentes = qPendentes.data?.content ?? [];
  const totalPendente = qPendentes.data?.totalElements ?? 0;
  const totalPages = qPendentes.data?.totalPages ?? 0;

  // ── render ──────────────────────────────────────────────────
  return (

    <div className="animate-fade-up">

      <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>
        Lançamento de Processo
      </h2>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '24px'
        }}
      >
        Registre o lançamento dos processos pendentes no sistema.
      </p>

      {/* GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '20px',
          alignItems: 'start',
        }}
      >

        {/* COLUNA PENDENTES */}
        <div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '14px',
            }}
          >

            <p className="section-title" style={{ margin: 0 }}>
              Processos Pendentes
            </p>

            <span
              style={{
                background: 'rgba(245,166,35,0.15)',
                border: '1px solid rgba(245,166,35,0.3)',
                color: '#f5a623',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 700,
              }}
            >
              {qPendentes.isLoading
                ? '...'
                : totalPendente.toLocaleString('pt-BR')}
            </span>

          </div>

          {/* tabela */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '12px',
            }}
          >

            <div style={{ overflowX: 'auto' }}>

              {qPendentes.isLoading ? (
                <Skeleton />
              ) : !pendentes.length ? (
                <Vazio texto="Nenhum processo pendente" />
              ) : (

                <table className="tabela">

                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CPF</th>
                      <th>UNLOC</th>
                      <th>Memorando</th>
                      <th>Data</th>
                      <th>Tipo</th>
                      <th>Lançar</th>
                    </tr>
                  </thead>

                  <tbody>

                    {pendentes.map((r: InscRenov) => (

                      <tr key={r.id}>

                        <td>{r.nome}</td>

                        <td
                          style={{
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                          }}
                        >
                          {r.cpf}
                        </td>

                        <td>
                          <span className="badge badge-insc">
                            {r.unloc}
                          </span>
                        </td>

                        <td
                          style={{
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                          }}
                        >
                          {r.memorando}
                        </td>

                        <td
                          style={{
                            fontFamily: 'JetBrains Mono',
                            fontSize: '11px'
                          }}
                        >
                          {r.datas
                            ? new Date(r.datas).toLocaleDateString('pt-BR')
                            : '—'}
                        </td>

                        <td>
                          <span
                            className={
                              r.descricao === 'INSC'
                                ? 'badge badge-insc'
                                : 'badge badge-renov'
                            }
                          >
                            {r.descricao}
                          </span>
                        </td>

                        <td>

                          <button
                            onClick={() => lancar.mutate(r.id)}
                            disabled={lancar.isPending}
                            className="btn btn-primary"
                            style={{
                              fontSize: '11px',
                              padding: '6px 10px'
                            }}
                          >
                            ✓ Lançar
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              )}

            </div>

          </div>

        </div>

        {/* COLUNA CPF */}
        <div>

          <p className="section-title" style={{ marginBottom: '14px' }}>
            Consultar por CPF
          </p>

          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '16px',
            }}
          >

            <label style={lbl}>CPF do produtor</label>

            <div style={{ display: 'flex', gap: '8px' }}>

              <input
                value={cpfBusca}
                onChange={(e) =>
                  setCpfBusca(formatarCPF(e.target.value))
                }
                placeholder="000.000.000-00"
                style={{ fontFamily: 'JetBrains Mono' }}
              />

              <button
                className="btn btn-primary"
                onClick={buscarCpf}
              >
                🔍
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

// ── helpers UI ───────────────────────────────────────────────
function Skeleton() {

  return (
    <div style={{ padding: '20px' }}>
      carregando...
    </div>
  );

}

function Vazio({ texto }: { texto: string }) {

  return (
    <div style={{ padding: '36px', textAlign: 'center' }}>
      <div style={{ fontSize: '30px' }}>📭</div>
      <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
        {texto}
      </p>
    </div>
  );

}

const lbl: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  fontFamily: 'JetBrains Mono, monospace',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '5px',
};