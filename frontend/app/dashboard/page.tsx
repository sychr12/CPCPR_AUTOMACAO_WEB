'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { useAuthStore } from '@/lib/api';
import type { DashboardStats } from '@/types';

import {
PlusCircle,
Search,
ClipboardList,
BarChart3,
FileText,
CornerUpLeft,
CreditCard,
LineChart,
RefreshCcw
} from "lucide-react";

// ── atalhos rápidos ───────────────────────────────────────────
const ATALHOS = [
  { icon: PlusCircle, label: 'Adicionar Dados', href: '/dashboard/adicionar-dados' },
  { icon: Search, label: 'Consultar Registros', href: '/dashboard/consulta' },
  { icon: ClipboardList, label: 'Lançar Processo', href: '/dashboard/lancamento-processo' },
  { icon: BarChart3, label: 'Análise por Município', href: '/dashboard/analise-processos' },
  { icon: FileText, label: 'Gerar Memorando', href: '/dashboard/memorando' },
  { icon: CornerUpLeft, label: 'Registrar Devolução', href: '/dashboard/devolucao' },
  { icon: CreditCard, label: 'Emitir Carteira Digital', href: '/dashboard/carteira-digital' },
  { icon: LineChart, label: 'Relatórios', href: '/dashboard/relatorios' },
];

export default function DashboardPage() {

const usuario = useAuthStore((s) => s.usuario);

const { data, isLoading, isError } = useQuery<DashboardStats>({
queryKey: ['dashboard-stats'],
queryFn: () => dashboardApi.stats().then((r) => r.data),
refetchInterval: 60_000,
});

const hora = new Date().getHours();

const saudacao =
hora < 12 ? 'Bom dia' :
hora < 18 ? 'Boa tarde' :
'Boa noite';

return (
<div>

{/* saudação */}

<div style={{ marginBottom: '32px' }}>

<p
style={{
fontSize: '11px',
letterSpacing: '2px',
color: '#64748b',
textTransform: 'uppercase',
marginBottom: '6px',
}}
>
{saudacao},
</p>

<h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
{usuario?.nome ?? '—'}
<span style={{ color: 'var(--gov-green)' }}>.</span>
</h1>

<p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
Visão geral do sistema CPCPR
</p>

</div>

{/* stats */}

<div
style={{
display: 'grid',
gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
gap: '14px',
marginBottom: '36px',
}}
>

<StatCard
label="Inscrições"
value={data?.totalInscricoes}
Icon={FileText}
loading={isLoading}
error={isError}
/>

<StatCard
label="Renovações"
value={data?.totalRenovacoes}
Icon={RefreshCcw}
loading={isLoading}
error={isError}
/>

<StatCard
label="Devoluções"
value={data?.totalDevolucoes}
Icon={CornerUpLeft}
loading={isLoading}
error={isError}
/>

<StatCard
label="Total Geral"
value={data?.total}
Icon={BarChart3}
loading={isLoading}
error={isError}
destaque
/>

</div>

{/* atalhos */}

<p
style={{
fontSize: '13px',
fontWeight: 600,
marginBottom: '14px',
color: '#334155'
}}
>
Acesso Rápido
</p>

<div
style={{
display: 'grid',
gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
gap: '12px',
}}
>

{ATALHOS.map((a) => {

const Icon = a.icon;

return (

<Link
key={a.href}
href={a.href}
style={{ textDecoration: 'none' }}
>

<div
style={{
background: '#fff',
border: '1px solid #e2e8f0',
borderRadius: '12px',
padding: '18px 16px',
display: 'flex',
flexDirection: 'column',
gap: '10px',
cursor: 'pointer',
transition: 'all .2s',
}}
>

<div
style={{
width: '36px',
height: '36px',
borderRadius: '10px',
background: 'var(--gov-green-bg)',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
}}
>

<Icon size={18} color="var(--gov-green)" />

</div>

<span
style={{
fontSize: '13px',
fontWeight: 600,
color: '#0f172a',
lineHeight: 1.3,
}}
>
{a.label}
</span>

</div>

</Link>

)

})}

</div>

{/* aviso */}

<div
style={{
marginTop: '32px',
padding: '14px 18px',
background: '#fff',
border: '1px solid #e2e8f0',
borderRadius: '10px',
display: 'flex',
alignItems: 'center',
gap: '12px',
}}
>

<BarChart3 size={18} color="var(--gov-blue-light)" />

<p
style={{
fontSize: '12px',
color: '#475569',
lineHeight: 1.6
}}
>

Funcionalidades de <strong>Carteira Digital</strong> e{' '}
<strong>Anexar</strong> requerem automação Selenium configurada no servidor.

</p>

</div>

</div>
);
}

// ── StatCard ─────────────────────────────────────────────

function StatCard({
label,
value,
Icon,
loading,
error,
destaque = false
}: {
label: string
value?: number
Icon: any
loading: boolean
error: boolean
destaque?: boolean
}) {

return (

<div
style={{
background: destaque ? 'var(--gov-green-bg)' : '#fff',
border: '1px solid #e2e8f0',
borderRadius: '12px',
padding: '20px',
display: 'flex',
flexDirection: 'column',
gap: '10px',
}}
>

<div style={{ display: 'flex', justifyContent: 'space-between' }}>

<span
style={{
fontSize: '11px',
letterSpacing: '1px',
color: '#64748b',
textTransform: 'uppercase',
}}
>
{label}
</span>

<Icon size={18} color="var(--gov-green)" />

</div>

{loading ? (
<Skeleton />
) : error ? (
<span style={{ fontSize: '13px', color: 'var(--gov-red)' }}>Erro</span>
) : (
<span
style={{
fontSize: '30px',
fontWeight: 800,
color: destaque ? 'var(--gov-green)' : '#0f172a',
}}
>
{(value ?? 0).toLocaleString('pt-BR')}
</span>
)}

</div>

)
}

// ── Skeleton ─────────────────────────────────────────────

function Skeleton() {

return (
<div
style={{
height: '32px',
borderRadius: '6px',
background: 'linear-gradient(90deg,#eee 25%,#ddd 50%,#eee 75%)',
backgroundSize: '200% 100%',
animation: 'shimmer 1.4s infinite',
width: '80px',
}}
>

<style>{`
@keyframes shimmer {
from { background-position: 200% 0; }
to { background-position: -200% 0; }
}
`}</style>

</div>
)

}