'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/api'

import {
LayoutDashboard,
Search,
PlusCircle,
BarChart3,
ClipboardList,
CreditCard,
FileText,
CornerUpLeft,
Paperclip,
LineChart,
KeyRound,
Leaf,
User,
LogOut
} from "lucide-react"

type MenuItem = {
icon: any
label: string
href: string
}

const MENU: MenuItem[] = [
{ icon: LayoutDashboard, label: 'Início', href: '/dashboard' },
{ icon: Search, label: 'Consulta de Dados', href: '/dashboard/consulta' },
{ icon: PlusCircle, label: 'Adicionar Dados', href: '/dashboard/adicionar-dados' },
{ icon: BarChart3, label: 'Análise de Processos', href: '/dashboard/analise-processos' },
{ icon: ClipboardList, label: 'Lançamento de Processo', href: '/dashboard/lancamento-processo' },
{ icon: CreditCard, label: 'Carteira Digital', href: '/dashboard/carteira-digital' },
{ icon: FileText, label: 'Memorando', href: '/dashboard/memorando' },
{ icon: CornerUpLeft, label: 'Devolução', href: '/dashboard/devolucao' },
{ icon: Paperclip, label: 'Anexar', href: '/dashboard/anexar' },
{ icon: LineChart, label: 'Relatórios', href: '/dashboard/relatorios' },
{ icon: KeyRound, label: 'Senha', href: '/dashboard/senha' },
]

const W_COLLAPSED = 56
const W_EXPANDED  = 220

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

const router = useRouter()
const pathname = usePathname()
const { usuario, token, logout } = useAuthStore()

const [expanded, setExpanded] = useState(false)
const [mounted, setMounted] = useState(false)

useEffect(() => {
setMounted(true)
if (!token) router.replace('/login')
}, [token, router])

if (!mounted || !token) return null

function handleLogout() {
logout()
router.replace('/login')
}

return (
<div style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8' }}>


<aside
onMouseEnter={() => setExpanded(true)}
onMouseLeave={() => setExpanded(false)}
style={{
position: 'fixed',
top: 0,
left: 0,
height: '100vh',
width: expanded ? W_EXPANDED : W_COLLAPSED,
background: 'var(--gov-navy)',
display: 'flex',
flexDirection: 'column',
zIndex: 100,
overflow: 'hidden',
transition: 'width .22s cubic-bezier(.4,0,.2,1)',
boxShadow: '4px 0 24px rgba(0,0,0,0.3)'
}}
>

<div
style={{
height: '56px',
display: 'flex',
alignItems: 'center',
gap: '10px',
padding: '0 14px',
borderBottom: '1px solid rgba(255,255,255,0.15)',
whiteSpace: 'nowrap'
}}
>

<Leaf size={20} color="var(--gov-gold)" />

<span
style={{
fontSize: '12px',
fontWeight: 700,
color: '#fff',
opacity: expanded ? 1 : 0,
transition: 'opacity .15s'
}}
>
CPCPR<br/>
<span style={{ fontWeight:400,fontSize:'10px',opacity:.8 }}>
Carteira do Produtor
</span>
</span>

</div>

<nav style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>

{MENU.map((item) => {

const active =
item.href === '/dashboard'
? pathname === '/dashboard'
: pathname.startsWith(item.href)

const Icon = item.icon

return (

<Link
key={item.href}
href={item.href}
style={{
display:'flex',
alignItems:'center',
gap:'12px',
padding:'10px 14px',
textDecoration:'none',
background: active ? 'var(--gov-green-bg)' : 'transparent',
borderLeft: active ? '3px solid var(--gov-green)' : '3px solid transparent',
color:'#fff'
}}
>

<Icon size={18} />

<span
style={{
fontSize:'12px',
fontWeight: active ? 700 : 400,
opacity: expanded ? 1 : 0,
transition:'opacity .15s'
}}
>
{item.label}
</span>

</Link>

)

})}

</nav>

<div
style={{
borderTop:'1px solid rgba(255,255,255,0.15)',
padding:'10px 14px'
}}
>

<div
style={{
display:'flex',
alignItems:'center',
gap:'10px',
marginBottom:'8px'
}}
>

<User size={18} color="#fff"/>

<div
style={{
opacity: expanded ? 1 : 0,
transition:'opacity .15s'
}}
>
<div style={{ fontSize:'11px', fontWeight:700, color:'#fff' }}>
{usuario?.nome ?? '—'}
</div>

<div style={{ fontSize:'9px', color:'rgba(255,255,255,.6)' }}>
{usuario?.perfil ?? 'USER'}
</div>
</div>

</div>

<button
onClick={handleLogout}
style={{
display:'flex',
alignItems:'center',
gap:'10px',
width:'100%',
background:'var(--gov-red)',
border:'none',
borderRadius:'8px',
padding:'7px 10px',
cursor:'pointer',
color:'#fff',
fontSize:'12px'
}}
>

<LogOut size={16} />

<span style={{ opacity: expanded ? 1 : 0 }}>
Sair
</span>

</button>

</div>

</aside>


<div
style={{
marginLeft: W_COLLAPSED,
flex:1,
minHeight:'100vh',
display:'flex',
flexDirection:'column'
}}
>

<header
style={{
height:'56px',
borderBottom:'1px solid #e2e8f0',
display:'flex',
alignItems:'center',
padding:'0 28px',
background:'var(--gov-navy-dark)'
}}
>

<BreadCrumb pathname={pathname} />

<div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'10px' }}>

<span style={{ fontSize:'11px', color:'#cbd5e1' }}>
{usuario?.nome}
</span>

<div
style={{
width:'8px',
height:'8px',
borderRadius:'50%',
background:'var(--gov-green)',
boxShadow:'0 0 6px var(--gov-green)'
}}
/>

</div>

</header>

<main style={{ flex:1, padding:'28px', overflowY:'auto' }}>
{children}
</main>

</div>

</div>
)
}

function BreadCrumb({ pathname }: { pathname:string }) {

const MAP: Record<string,string> = {
'/dashboard':'Início',
'/dashboard/consulta':'Consulta de Dados',
'/dashboard/adicionar-dados':'Adicionar Dados',
'/dashboard/analise-processos':'Análise de Processos',
'/dashboard/lancamento-processo':'Lançamento de Processo',
'/dashboard/carteira-digital':'Carteira Digital',
'/dashboard/memorando':'Memorando',
'/dashboard/devolucao':'Devolução',
'/dashboard/anexar':'Anexar',
'/dashboard/relatorios':'Relatórios',
'/dashboard/senha':'Senha'
}

const label = MAP[pathname] ?? 'Dashboard'

return (
<div style={{ display:'flex', alignItems:'center', gap:'8px' }}>

<span style={{ fontSize:'12px', color:'#cbd5e1' }}>
CPCPR
</span>

<span style={{ color:'#64748b', fontSize:'12px' }}>
/
</span>

<span style={{ fontSize:'13px', fontWeight:600, color:'#fff' }}>
{label}
</span>

</div>
)
}