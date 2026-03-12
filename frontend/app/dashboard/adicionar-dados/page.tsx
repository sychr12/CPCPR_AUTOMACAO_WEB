'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import {
FileText,
CornerUpLeft,
Plus,
Save,
X,
AlertCircle,
MapPin
} from "lucide-react";

import { inscRenovApi, devApi, municipioApi } from '@/lib/api';
import type { InscRenovRequest, DevRequest, Municipio } from '@/types';

type Modo = 'inscrenov' | 'dev';

function formatarCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export default function AdicionarDadosPage() {

const [modo, setModo] = useState<Modo>('inscrenov');
const [linhas, setLinhas] = useState<(InscRenovRequest | DevRequest)[]>([]);
const [municipios, setMunicipios] = useState<Municipio[]>([]);
const [queryMun, setQueryMun] = useState('');
const [showDrop, setShowDrop] = useState(false);
const [munSelecionado, setMunSelecionado] = useState('');

const munRef = useRef<HTMLDivElement>(null);
const qc = useQueryClient();

const [form, setForm] = useState({
nome: '',
cpf: '',
memorando: '',
datas: new Date().toISOString().split('T')[0],
descricao: 'INSC' as 'INSC' | 'RENOV',
motivo: '',
urgente: false,
});

function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
setForm(f => ({ ...f, [key]: value }));
}

useEffect(() => {

if (!queryMun.trim()) {
setMunicipios([]);
return;
}

const t = setTimeout(() => {
municipioApi.buscar(queryMun)
.then(r => setMunicipios(r.data))
.catch(() => {});
}, 250);

return () => clearTimeout(t);

}, [queryMun]);

useEffect(() => {

function h(e: MouseEvent) {
if (munRef.current && !munRef.current.contains(e.target as Node))
setShowDrop(false);
}

document.addEventListener('mousedown', h);

return () => document.removeEventListener('mousedown', h);

}, []);

const enviarInsc = useMutation({
mutationFn: (d: InscRenovRequest[]) => inscRenovApi.criarLote(d),
onSuccess: r => {
toast.success(`${r.data.length} registro(s) salvos!`);
setLinhas([]);
qc.invalidateQueries({ queryKey: ['inscrenov'] });
},
onError: () => toast.error('Erro ao salvar'),
});

const enviarDev = useMutation({
mutationFn: (d: DevRequest[]) => devApi.criarLote(d),
onSuccess: r => {
toast.success(`${r.data.length} devolução(ões) salvas!`);
setLinhas([]);
qc.invalidateQueries({ queryKey: ['dev'] });
},
onError: () => toast.error('Erro ao salvar'),
});

function adicionarLinha() {

if (!form.nome.trim()) return toast.error('Nome é obrigatório');
if (form.cpf.length < 14) return toast.error('CPF incompleto');
if (!munSelecionado) return toast.error('Selecione um município');
if (!form.memorando.trim()) return toast.error('Memorando é obrigatório');
if (modo === 'dev' && !form.motivo.trim()) return toast.error('Motivo é obrigatório');

const base = {
nome: form.nome.toUpperCase().trim(),
cpf: form.cpf,
unloc: munSelecionado,
memorando: form.memorando.trim()
};

if (modo === 'inscrenov') {

setLinhas(p => [
...p,
{
...base,
datas: form.datas,
descricao: form.descricao,
urgente: form.urgente
}
]);

} else {

setLinhas(p => [
...p,
{
...base,
datas: [form.datas],
motivo: form.motivo.trim()
}
]);

}

setForm(f => ({
...f,
nome: '',
cpf: '',
motivo: '',
urgente: false
}));

}

const isSaving = enviarInsc.isPending || enviarDev.isPending;

return (

<div className="animate-fade-up">

<div className="page-header">

<div>

<h2 className="page-titulo">
<FileText size={20} style={{marginRight:8}}/>
Adicionar Dados
</h2>

<p className="page-subtitulo">
Preencha, adicione à lista e envie para o banco de dados.
</p>

</div>

</div>

<div className="add-modo-tabs">

<button
className={`add-modo-btn ${modo === 'inscrenov' ? 'active' : ''}`}
onClick={() => { setModo('inscrenov'); setLinhas([]); }}
>

<FileText size={16}/>
Inscrição / Renovação

</button>

<button
className={`add-modo-btn ${modo === 'dev' ? 'active' : ''}`}
onClick={() => { setModo('dev'); setLinhas([]); }}
>

<CornerUpLeft size={16}/>
Devolução

</button>

</div>

{/* FORM */}

<div className="add-form">

{/* grid */}

{/* (mesmo layout que você já tinha) */}

{/* checkbox urgente */}

{modo === 'inscrenov' && (

<label className="campo-check">

<input
type="checkbox"
checked={form.urgente}
onChange={e => setField('urgente', e.target.checked)}
/>

<AlertCircle size={16}/>
Marcar como URGENTE

</label>

)}

<div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>

<button className="btn-secondary btn" onClick={adicionarLinha}>

<Plus size={16}/>
Adicionar à lista

</button>

</div>

</div>

{/* LISTA */}

{linhas.length > 0 && (

<div style={{
background: 'var(--bg-card)',
border: '1.5px solid var(--border)',
borderRadius: 'var(--radius-lg)',
overflow: 'hidden'
}}>

<div className="lista-header">

<span>
Lista para envio — {linhas.length} registro(s)
</span>

<button
className="btn-primary btn"
onClick={() =>
modo === 'inscrenov'
? enviarInsc.mutate(linhas as InscRenovRequest[])
: enviarDev.mutate(linhas as DevRequest[])
}
disabled={isSaving}
>

<Save size={16}/>

{isSaving ? 'Salvando...' : 'Enviar para o Banco'}

</button>

</div>

<div style={{ overflowX: 'auto' }}>

<table className="tabela">

<thead>
<tr>
<th>#</th>
<th>Nome</th>
<th>CPF</th>
<th>UNLOC</th>
<th>Memorando</th>
<th></th>
</tr>
</thead>

<tbody>

{linhas.map((l, i) => (

<tr key={i}>

<td>{i + 1}</td>

<td style={{ fontWeight: 600 }}>
{l.nome}
</td>

<td>
{l.cpf}
</td>

<td>
<span className="badge badge-insc">
<MapPin size={12}/>
{l.unloc}
</span>
</td>

<td>
{l.memorando}
</td>

<td>

<button
onClick={() =>
setLinhas(p => p.filter((_, idx) => idx !== i))
}
className="btn-remove"
>

<X size={14}/>

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)}

</div>

);

}