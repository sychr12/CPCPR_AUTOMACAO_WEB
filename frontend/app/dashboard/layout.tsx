'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/api';

// ── menu items ───────────────────────────────────────────────
const MENU = [
  { icon: '🏠', label: 'Início',                href: '/dashboard' },
  { icon: '🔍', label: 'Consulta de Dados',     href: '/dashboard/consulta' },
  { icon: '➕', label: 'Adicionar Dados',        href: '/dashboard/adicionar-dados' },
  { icon: '📊', label: 'Análise de Processos',  href: '/dashboard/analise-processos' },
  { icon: '📋', label: 'Lançamento de Processo',href: '/dashboard/lancamento-processo' },
  { icon: '🪪', label: 'Carteira Digital',       href: '/dashboard/carteira-digital' },
  { icon: '📝', label: 'Memorando',             href: '/dashboard/memorando' },
  { icon: '↩️', label: 'Devolução',             href: '/dashboard/devolucao' },
  { icon: '📎', label: 'Anexar',                href: '/dashboard/anexar' },
  { icon: '📈', label: 'Relatórios',            href: '/dashboard/relatorios' },
  { icon: '🔒', label: 'Senha',                 href: '/dashboard/senha' },
];

const W_COLLAPSED = 56;
const W_EXPANDED  = 220;

// ── layout ───────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { usuario, token, logout } = useAuthStore();

  const [expanded, setExpanded] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  // guarda de rota — redireciona se não autenticado
  useEffect(() => {
    setMounted(true);
    if (!token) router.replace('/login');
  }, [token, router]);

  if (!mounted || !token) return null;

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── SIDEBAR ──────────────────────────────────────── */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          height:          '100vh',
          width:           expanded ? W_EXPANDED : W_COLLAPSED,
          background:      'var(--green)',
          display:         'flex',
          flexDirection:   'column',
          zIndex:          100,
          overflow:        'hidden',
          transition:      'width 0.22s cubic-bezier(.4,0,.2,1)',
          boxShadow:       '4px 0 24px rgba(0,0,0,0.4)',
          flexShrink:      0,
        }}
      >

        {/* cabeçalho da sidebar */}
        <div
          style={{
            height:        '56px',
            display:       'flex',
            alignItems:    'center',
            gap:           '10px',
            padding:       '0 14px',
            borderBottom:  '1px solid rgba(255,255,255,0.15)',
            flexShrink:    0,
            overflow:      'hidden',
            whiteSpace:    'nowrap',
          }}
        >
          <span style={{ fontSize: '22px', flexShrink: 0 }}>🌿</span>
          <span
            style={{
              fontSize:   '12px',
              fontWeight: 700,
              color:      '#fff',
              opacity:    expanded ? 1 : 0,
              transition: 'opacity 0.15s',
              lineHeight: 1.2,
            }}
          >
            CPCPR<br />
            <span style={{ fontWeight: 400, fontSize: '10px', opacity: 0.8 }}>
              Carteira do Produtor
            </span>
          </span>
        </div>

        {/* itens do menu */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
          {MENU.map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '12px',
                  padding:        '10px 14px',
                  textDecoration: 'none',
                  background:     active ? 'rgba(0,0,0,0.25)' : 'transparent',
                  borderLeft:     active ? '3px solid #fff' : '3px solid transparent',
                  transition:     'background 0.15s',
                  whiteSpace:     'nowrap',
                  overflow:       'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '18px', flexShrink: 0, width: '24px', textAlign: 'center' }}>
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize:   '12px',
                    fontWeight: active ? 700 : 400,
                    color:      '#fff',
                    opacity:    expanded ? 1 : 0,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* rodapé da sidebar — usuário + logout */}
        <div
          style={{
            borderTop:   '1px solid rgba(255,255,255,0.15)',
            padding:     '10px 14px',
            flexShrink:  0,
            overflow:    'hidden',
            whiteSpace:  'nowrap',
          }}
        >
          {/* info do usuário */}
          <div
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '10px',
              marginBottom: '6px',
            }}
          >
            <div
              style={{
                width:        '28px',
                height:       '28px',
                borderRadius: '50%',
                background:   'rgba(0,0,0,0.3)',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                fontSize:     '13px',
                flexShrink:   0,
              }}
            >
              👤
            </div>
            <div
              style={{
                opacity:    expanded ? 1 : 0,
                transition: 'opacity 0.15s',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                {usuario?.nome ?? '—'}
              </div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace' }}>
                {usuario?.perfil ?? 'USER'}
              </div>
            </div>
          </div>

          {/* botão sair */}
          <button
            onClick={handleLogout}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '10px',
              width:          '100%',
              background:     'rgba(0,0,0,0.2)',
              border:         '1px solid rgba(255,255,255,0.15)',
              borderRadius:   '8px',
              padding:        '7px 10px',
              cursor:         'pointer',
              color:          '#fff',
              fontSize:       '12px',
              fontFamily:     'Sora, sans-serif',
              transition:     'background 0.15s',
              whiteSpace:     'nowrap',
              overflow:       'hidden',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.2)')}
          >
            <span style={{ fontSize: '15px', flexShrink: 0 }}>🚪</span>
            <span style={{ opacity: expanded ? 1 : 0, transition: 'opacity 0.15s' }}>
              Sair
            </span>
          </button>
        </div>

      </aside>

      {/* ── CONTEÚDO PRINCIPAL ───────────────────────────── */}
      <div
        style={{
          marginLeft:  W_COLLAPSED,
          flex:        1,
          minHeight:   '100vh',
          display:     'flex',
          flexDirection: 'column',
          transition:  'margin-left 0.22s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* topbar */}
        <header
          style={{
            height:        '56px',
            borderBottom:  '1px solid var(--border)',
            display:       'flex',
            alignItems:    'center',
            padding:       '0 28px',
            background:    'var(--bg-card)',
            flexShrink:    0,
            gap:           '12px',
          }}
        >
          {/* breadcrumb simples */}
          <BreadCrumb pathname={pathname} />

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize:   '11px',
                color:      'var(--text-muted)',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {usuario?.nome}
            </span>
            <div
              style={{
                width:        '8px',
                height:       '8px',
                borderRadius: '50%',
                background:   'var(--green)',
                boxShadow:    '0 0 6px var(--green)',
              }}
            />
          </div>
        </header>

        {/* página */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </main>

      </div>
    </div>
  );
}

// ── breadcrumb ────────────────────────────────────────────────
function BreadCrumb({ pathname }: { pathname: string }) {
  const MAP: Record<string, string> = {
    '/dashboard':                    'Início',
    '/dashboard/consulta':           'Consulta de Dados',
    '/dashboard/adicionar-dados':    'Adicionar Dados',
    '/dashboard/analise-processos':  'Análise de Processos',
    '/dashboard/lancamento-processo':'Lançamento de Processo',
    '/dashboard/carteira-digital':   'Carteira Digital',
    '/dashboard/memorando':          'Memorando',
    '/dashboard/devolucao':          'Devolução',
    '/dashboard/anexar':             'Anexar',
    '/dashboard/relatorios':         'Relatórios',
    '/dashboard/senha':              'Senha',
  };

  const label = MAP[pathname] ?? 'Dashboard';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
        CPCPR
      </span>
      <span style={{ color: 'var(--border)', fontSize: '12px' }}>/</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
        {label}
      </span>
    </div>
  );
}