// ═══════════════════════════════════════════════════
// DEVOLUÇÃO — devolucao/page.tsx
// ═══════════════════════════════════════════════════
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { devApi, municipioApi, useAuthStore } from '@/lib/api';
import type { Dev, Municipio } from '@/types';

export default function DevolucaoPage() {
  const usuario = useAuthStore(s => s.usuario);
  const qc = useQueryClient();
  const [memorando, setMemorando] = useState('');
  const [munSelecionado, setMunSelecionado] = useState('');
  const [munNome, setMunNome] = useState('');
  const [queryMun, setQueryMun] = useState('');
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [showDrop, setShowDrop] = useState(false);
  const munRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function h(e: MouseEvent) { if (munRef.current && !munRef.current.contains(e.target as Node)) setShowDrop(false); }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    if (!queryMun.trim()) { setMunicipios([]); return; }
    const t = setTimeout(() => municipioApi.buscar(queryMun).then(r => setMunicipios(r.data)).catch(() => {}), 250);
    return () => clearTimeout(t);
  }, [queryMun]);

  const podeBuscar = munSelecionado.length > 0 && memorando.trim().length > 0;

  const qPendentes = useQuery({
    queryKey: ['dev-pendentes', munSelecionado, memorando],
    queryFn: () => devApi.pendentes({ unloc: munSelecionado, memorando }).then(r => r.data as Dev[]),
    enabled: podeBuscar,
  });

  const pendentes = qPendentes.data ?? [];

  const marcar = useMutation({
    mutationFn: () => devApi.marcarEnvio({ unloc: munSelecionado, memorando }),
    onSuccess: () => { toast.success('Marcadas como enviadas!'); qc.invalidateQueries({ queryKey: ['dev-pendentes'] }); qc.invalidateQueries({ queryKey: ['dev'] }); },
    onError: () => toast.error('Erro ao marcar'),
  });

  function gerarDocumento() {
    if (!pendentes.length) { toast.error('Nenhuma devolução encontrada'); return; }
    const dataFmt = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const conteudo = [
      '='.repeat(70), 'RELAÇÃO DE DEVOLUÇÕES', '='.repeat(70), '',
      `DATA            : ${dataFmt}`, `MUNICÍPIO       : ${munNome} (${munSelecionado})`,
      `MEMORANDO       : ${memorando}`, `GERADO POR      : ${usuario?.nome ?? '—'}`,
      '', '-'.repeat(70), `TOTAL : ${pendentes.length}`, '-'.repeat(70), '',
      ...pendentes.map((d, i) => `  ${String(i+1).padStart(2,'0')}. ${d.nome.padEnd(48)} CPF: ${d.cpf}\n      Motivo: ${d.motivo}\n`),
      '='.repeat(70),
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([conteudo], { type: 'text/plain;charset=utf-8' }));
    a.download = `DEV_${munSelecionado}_${memorando.replace(/\//g,'-')}.txt`;
    a.click();
    toast.success('Documento gerado!');
  }

  return (
    <>
      <style>{`
        .dev-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }
        @media (max-width: 800px) { .dev-layout { grid-template-columns: 1fr; } }
        .dev-filtro { background: var(--bg-card); border: 1.5px solid var(--border); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow-sm); }
        .dev-drop { position: absolute; top: 100%; left: 0; right: 0; z-index: 60; background: var(--bg-card); border: 1.5px solid var(--gov-green); border-radius: var(--radius-sm); max-height: 200px; overflow-y: auto; box-shadow: var(--shadow-md); }
        .dev-drop-item { padding: 9px 14px; cursor: pointer; display: flex; gap: 10px; align-items: center; font-size: 13px; }
        .dev-drop-item:hover { background: var(--bg); }
        .dev-acoes { margin-top: 14px; display: flex; flex-direction: column; gap: 8px; }
      `}</style>
      <div className="animate-fade-up">
        <div className="page-header">
          <div><h2 className="page-titulo">Devolução</h2><p className="page-subtitulo">Consulte devoluções, gere documentos e marque como enviadas.</p></div>
        </div>
        <div className="dev-layout">
          <div>
            <div className="dev-filtro">
              <p className="section-title" style={{ marginBottom: 16 }}>Filtrar</p>
              <div ref={munRef} style={{ marginBottom: 14, position: 'relative' }}>
                <label className="campo-label">Município</label>
                <input value={queryMun} onChange={e => { setQueryMun(e.target.value); setMunSelecionado(''); setShowDrop(true); }} onFocus={() => setShowDrop(true)} placeholder="Buscar município..." />
                {showDrop && municipios.length > 0 && (
                  <div className="dev-drop">
                    {municipios.map(m => (
                      <div key={m.codigo} className="dev-drop-item" onClick={() => { setMunSelecionado(m.codigo); setMunNome(m.nome); setQueryMun(m.nome); setShowDrop(false); }}>
                        <span style={{ fontFamily: 'Teko,monospace', color: 'var(--gov-green)', fontWeight: 700, minWidth: 60 }}>{m.codigo}</span>
                        <span style={{ fontSize: 13 }}>{m.nome}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="campo-label">Memorando</label>
                <input value={memorando} onChange={e => setMemorando(e.target.value)} placeholder="Nº do memorando" />
              </div>
            </div>
            {pendentes.length > 0 && (
              <div className="dev-acoes">
                <button className="btn-primary btn" onClick={gerarDocumento}>📄 Gerar Documento (.txt)</button>
                <button className="btn-secondary btn" onClick={() => marcar.mutate()} disabled={marcar.isPending}>
                  {marcar.isPending ? '⏳ Marcando...' : '✅ Marcar como Enviado'}
                </button>
              </div>
            )}
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            {!podeBuscar ? (
              <div style={{ padding: 48, textAlign: 'center' }}><div style={{ fontSize: 32 }}>↩️</div><p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>Informe município e memorando para buscar.</p></div>
            ) : qPendentes.isLoading ? (
              <div style={{ padding: 24, color: 'var(--text-muted)', textAlign: 'center' }}>Buscando...</div>
            ) : !pendentes.length ? (
              <div style={{ padding: 48, textAlign: 'center' }}><div style={{ fontSize: 32 }}>✅</div><p style={{ color: 'var(--gov-green)', fontFamily: 'Teko,sans-serif', fontSize: 18, marginTop: 8 }}>Nenhuma devolução pendente</p></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="tabela">
                  <thead><tr><th>#</th><th>Nome</th><th>CPF</th><th>Motivo</th><th>Analista</th></tr></thead>
                  <tbody>
                    {pendentes.map((d, i) => (
                      <tr key={d.id}>
                        <td style={{ fontFamily: 'Teko,monospace', color: 'var(--text-muted)' }}>{i+1}</td>
                        <td style={{ fontWeight: 600 }}>{d.nome}</td>
                        <td style={{ fontFamily: 'Teko,monospace', fontSize: 12 }}>{d.cpf}</td>
                        <td>{d.motivo}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{d.analise ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
