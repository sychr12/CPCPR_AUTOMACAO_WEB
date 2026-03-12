// ═══════════════════════════════════════════════════════
// LANÇAMENTO DE PROCESSO — lancamento-processo/page.tsx
// ═══════════════════════════════════════════════════════
'use client';
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { inscRenovApi } from '@/lib/api';
import type { InscRenov } from '@/types';

export default function LancamentoProcessoPage() {
  const [cpfBusca, setCpfBusca] = useState('');
  const [cpfAtivo, setCpfAtivo] = useState('');
  const [paginaPend, setPaginaPend] = useState(0);
  const qc = useQueryClient();

  const qPendentes = useQuery({
    queryKey: ['inscrenov-pendentes', paginaPend],
    queryFn: () => inscRenovApi.listar({ lancou: 'pendente', page: paginaPend, size: 15 }).then(r => r.data),
  });

  const qCpf = useQuery({
    queryKey: ['inscrenov-cpf', cpfAtivo],
    queryFn: () => inscRenovApi.buscar(cpfAtivo).then(r => r.data as InscRenov[]),
    enabled: cpfAtivo.length === 14,
  });

  const lancar = useMutation({
    mutationFn: (id: number) => inscRenovApi.lancar(id),
    onSuccess: () => {
      toast.success('Processo lançado!');
      qc.invalidateQueries({ queryKey: ['inscrenov-pendentes'] });
      qc.invalidateQueries({ queryKey: ['inscrenov-cpf'] });
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: () => toast.error('Erro ao lançar'),
  });

  function formatarCPF(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  const pendentes = qPendentes.data?.content ?? [];
  const totalPendente = qPendentes.data?.totalElements ?? 0;
  const totalPages = qPendentes.data?.totalPages ?? 0;

  return (
    <>
      <style>{`
        .lanc-layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
        @media (max-width: 900px) { .lanc-layout { grid-template-columns: 1fr; } }
        .total-badge {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 3px 12px; border-radius: 20px;
          background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.25);
          font-family: 'Teko',monospace; font-size: 14px; font-weight: 700; color: #d97706;
        }
        .cpf-card { background: var(--bg-card); border: 1.5px solid var(--border); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow-sm); }
        .cpf-busca-row { display: flex; gap: 8px; }
        .cpf-busca-row input { flex: 1; font-family: 'Teko',monospace; letter-spacing: 1px; }
      `}</style>

      <div className="animate-fade-up">
        <div className="page-header">
          <div>
            <h2 className="page-titulo">Lançamento de Processo</h2>
            <p className="page-subtitulo">Registre o lançamento dos processos pendentes.</p>
          </div>
        </div>

        <div className="lanc-layout">
          {/* pendentes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <p className="section-title" style={{ margin: 0 }}>Processos Pendentes</p>
              <span className="total-badge">{qPendentes.isLoading ? '...' : totalPendente.toLocaleString('pt-BR')}</span>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 12, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ overflowX: 'auto' }}>
                {qPendentes.isLoading ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando...</div>
                ) : !pendentes.length ? (
                  <div style={{ padding: 40, textAlign: 'center' }}>
                    <div style={{ fontSize: 32 }}>✅</div>
                    <p style={{ fontFamily: 'Teko,sans-serif', fontSize: 18, color: 'var(--text-muted)', marginTop: 8 }}>Nenhum processo pendente</p>
                  </div>
                ) : (
                  <table className="tabela">
                    <thead><tr><th>Nome</th><th>CPF</th><th>UNLOC</th><th>Memorando</th><th>Data</th><th>Tipo</th><th>Lançar</th></tr></thead>
                    <tbody>
                      {pendentes.map((r: InscRenov) => (
                        <tr key={r.id}>
                          <td style={{ fontWeight: 600 }}>{r.nome}</td>
                          <td style={{ fontFamily: 'Teko,monospace', fontSize: 12 }}>{r.cpf}</td>
                          <td><span className="badge badge-insc">{r.unloc}</span></td>
                          <td style={{ fontFamily: 'Teko,monospace', fontSize: 12 }}>{r.memorando}</td>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.datas ? new Date(r.datas).toLocaleDateString('pt-BR') : '—'}</td>
                          <td><span className={r.descricao === 'INSC' ? 'badge badge-insc' : 'badge badge-renov'}>{r.descricao}</span></td>
                          <td>
                            <button onClick={() => lancar.mutate(r.id)} disabled={lancar.isPending} className="btn-primary btn" style={{ fontSize: 11, padding: '5px 12px' }}>
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

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                <button className="btn" onClick={() => setPaginaPend(p => Math.max(0, p - 1))} disabled={paginaPend === 0}>← Anterior</button>
                <button className="btn" onClick={() => setPaginaPend(p => Math.min(totalPages - 1, p + 1))} disabled={paginaPend >= totalPages - 1}>Próxima →</button>
              </div>
            )}
          </div>

          {/* cpf */}
          <div>
            <p className="section-title" style={{ marginBottom: 14 }}>Consultar por CPF</p>
            <div className="cpf-card">
              <label className="campo-label">CPF do Produtor</label>
              <div className="cpf-busca-row">
                <input value={cpfBusca} onChange={e => setCpfBusca(formatarCPF(e.target.value))} placeholder="000.000.000-00" />
                <button className="btn-primary btn" onClick={() => { if (cpfBusca.length < 14) { toast.error('CPF inválido'); return; } setCpfAtivo(cpfBusca); }}>🔍</button>
              </div>
            </div>

            {qCpf.data && qCpf.data.length > 0 && (
              <div style={{ marginTop: 14, background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <table className="tabela">
                  <thead><tr><th>UNLOC</th><th>Tipo</th><th>Status</th></tr></thead>
                  <tbody>
                    {qCpf.data.map(r => (
                      <tr key={r.id}>
                        <td><span className="badge badge-insc">{r.unloc}</span></td>
                        <td><span className={r.descricao === 'INSC' ? 'badge badge-insc' : 'badge badge-renov'}>{r.descricao}</span></td>
                        <td>{r.lancou ? <span style={{ color: 'var(--gov-green)', fontWeight: 600, fontSize: 12 }}>✅ Lançado</span> : <span className="badge badge-warn">⏳ Pendente</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {qCpf.data && qCpf.data.length === 0 && (
              <div style={{ marginTop: 14, padding: 24, textAlign: 'center', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Nenhum registro para este CPF.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
