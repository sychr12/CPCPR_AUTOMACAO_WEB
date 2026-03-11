'use client';

import Link                from 'next/link';
import { useQuery }        from '@tanstack/react-query';
import { dashboardApi }    from '@/lib/api';
import { useAuthStore }    from '@/lib/api';
import type { DashboardStats } from '@/types';

// ── atalhos rápidos ───────────────────────────────────────────
const ATALHOS = [
  { icon: '➕', label: 'Adicionar Dados',         href: '/dashboard/adicionar-dados',     cor: '#2FA572' },
  { icon: '🔍', label: 'Consultar Registros',     href: '/dashboard/consulta',            cor: '#4a9eff' },
  { icon: '📋', label: 'Lançar Processo',         href: '/dashboard/lancamento-processo', cor: '#a78bfa' },
  { icon: '📊', label: 'Análise por Município',   href: '/dashboard/analise-processos',   cor: '#f5a623' },
  { icon: '📝', label: 'Gerar Memorando',         href: '/dashboard/memorando',           cor: '#2FA572' },
  { icon: '↩️', label: 'Registrar Devolução',    href: '/dashboard/devolucao',           cor: '#e05252' },
  { icon: '🪪', label: 'Emitir Carteira Digital', href: '/dashboard/carteira-digital',    cor: '#4a9eff' },
  { icon: '📈', label: 'Relatórios',              href: '/dashboard/relatorios',          cor: '#f5a623' },
];

// ── componente ────────────────────────────────────────────────
export default function DashboardPage() {
  const usuario = useAuthStore((s) => s.usuario);

  const { data, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn:  () => dashboardApi.stats().then((r) => r.data),
    refetchInterval: 60_000, // atualiza a cada 1 minuto
  });

  const hora = new Date().getHours();
  const saudacao =
    hora < 12 ? 'Bom dia' :
    hora < 18 ? 'Boa tarde' :
                'Boa noite';

  return (
    <div className="animate-fade-up">

      {/* saudação */}
      <div style={{ marginBottom: '32px' }}>
        <p
          style={{
            fontFamily:    'JetBrains Mono, monospace',
            fontSize:      '11px',
            letterSpacing: '2px',
            color:         'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom:  '6px',
          }}
        >
          {saudacao},
        </p>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff' }}>
          {usuario?.nome ?? '—'}
          <span style={{ color: 'var(--green)' }}>.</span>
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Visão geral do sistema CPCPR
        </p>
      </div>

      {/* ── CARDS DE ESTATÍSTICAS ── */}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap:                 '14px',
          marginBottom:        '36px',
        }}
      >
        <StatCard
          label="Inscrições"
          value={data?.totalInscricoes}
          icon="📄"
          cor="#2FA572"
          loading={isLoading}
          error={isError}
        />
        <StatCard
          label="Renovações"
          value={data?.totalRenovacoes}
          icon="🔄"
          cor="#4a9eff"
          loading={isLoading}
          error={isError}
        />
        <StatCard
          label="Devoluções"
          value={data?.totalDevolucoes}
          icon="↩️"
          cor="#f5a623"
          loading={isLoading}
          error={isError}
        />
        <StatCard
          label="Total Geral"
          value={data?.total}
          icon="📊"
          cor="#a78bfa"
          loading={isLoading}
          error={isError}
          destaque
        />
      </div>

      {/* ── ATALHOS RÁPIDOS ── */}
      <div style={{ marginBottom: '20px' }}>
        <p className="section-title">Acesso Rápido</p>
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap:                 '12px',
          }}
        >
          {ATALHOS.map((a, i) => (
            <Link
              key={a.href}
              href={a.href}
              style={{
                textDecoration: 'none',
                animationDelay: `${i * 0.04}s`,
              }}
              className="animate-fade-up"
            >
              <div
                style={{
                  background:    'var(--bg-card)',
                  border:        '1px solid var(--border)',
                  borderRadius:  '12px',
                  padding:       '18px 16px',
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           '10px',
                  cursor:        'pointer',
                  transition:    'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = a.cor;
                  el.style.boxShadow   = `0 0 18px ${a.cor}22`;
                  el.style.transform   = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border)';
                  el.style.boxShadow   = 'none';
                  el.style.transform   = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width:        '36px',
                    height:       '36px',
                    borderRadius: '10px',
                    background:   `${a.cor}18`,
                    border:       `1px solid ${a.cor}33`,
                    display:      'flex',
                    alignItems:   'center',
                    justifyContent: 'center',
                    fontSize:     '18px',
                  }}
                >
                  {a.icon}
                </div>
                <span
                  style={{
                    fontSize:   '12px',
                    fontWeight: 600,
                    color:      '#ddd',
                    lineHeight: 1.3,
                  }}
                >
                  {a.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── NOTA RODAPÉ ── */}
      <div
        style={{
          marginTop:    '32px',
          padding:      '14px 18px',
          background:   'var(--bg-card)',
          border:       '1px solid var(--border)',
          borderRadius: '10px',
          display:      'flex',
          alignItems:   'center',
          gap:          '12px',
        }}
      >
        <span style={{ fontSize: '18px' }}>ℹ️</span>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Funcionalidades de <strong style={{ color: '#ddd' }}>Carteira Digital</strong> e{' '}
          <strong style={{ color: '#ddd' }}>Anexar</strong> requerem automação Selenium
          configurada no servidor.
        </p>
      </div>

    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  cor,
  loading,
  error,
  destaque = false,
}: {
  label:    string;
  value?:   number;
  icon:     string;
  cor:      string;
  loading:  boolean;
  error:    boolean;
  destaque?: boolean;
}) {
  return (
    <div
      style={{
        background:    destaque ? `${cor}12` : 'var(--bg-card)',
        border:        `1px solid ${destaque ? cor + '44' : 'var(--border)'}`,
        borderRadius:  '12px',
        padding:       '20px 20px',
        display:       'flex',
        flexDirection: 'column',
        gap:           '10px',
        transition:    'box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontFamily:    'JetBrains Mono, monospace',
            fontSize:      '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color:         'var(--text-muted)',
          }}
        >
          {label}
        </span>
        <div
          style={{
            width:        '30px',
            height:       '30px',
            borderRadius: '8px',
            background:   `${cor}18`,
            border:       `1px solid ${cor}33`,
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'center',
            fontSize:     '15px',
          }}
        >
          {icon}
        </div>
      </div>

      {loading ? (
        <Skeleton />
      ) : error ? (
        <span style={{ fontSize: '13px', color: '#e05252' }}>Erro</span>
      ) : (
        <span
          style={{
            fontSize:   '32px',
            fontWeight: 800,
            color:      destaque ? cor : '#fff',
            lineHeight: 1,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {(value ?? 0).toLocaleString('pt-BR')}
        </span>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function Skeleton() {
  return (
    <div
      style={{
        height:       '32px',
        borderRadius: '6px',
        background:   'linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)',
        backgroundSize: '200% 100%',
        animation:    'shimmer 1.4s infinite',
        width:        '80px',
      }}
    >
      <style>{`
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}