'use client';

import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { inscRenovApi, devApi, municipioApi } from "@/lib/api";
import type { InscRenovRequest, DevRequest, Municipio } from "@/types";

type Modo = "inscrenov" | "dev";

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
  const [showDropMun, setShowDropMun] = useState(false);
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

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  useEffect(() => {

    if (!queryMun.trim()) {
      setMunicipios([]);
      return;
    }

    const timer = setTimeout(() => {
      municipioApi.buscar(queryMun.trim())
        .then((r) => setMunicipios(r.data))
        .catch(() => { });
    }, 250);

    return () => clearTimeout(timer);

  }, [queryMun]);

  useEffect(() => {

    function handler(e: MouseEvent) {
      if (munRef.current && !munRef.current.contains(e.target as Node)) {
        setShowDropMun(false);
      }
    }

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);

  }, []);

  const enviarInsc = useMutation({
    mutationFn: (data: InscRenovRequest[]) => inscRenovApi.criarLote(data),
    onSuccess: (r) => {
      toast.success(`${r.data.length} registro(s) salvos com sucesso!`);
      setLinhas([]);
      qc.invalidateQueries({ queryKey: ['inscrenov'] });
    },
    onError: () => toast.error('Erro ao salvar registros'),
  });

  const enviarDev = useMutation({
    mutationFn: (data: DevRequest[]) => devApi.criarLote(data),
    onSuccess: (r) => {
      toast.success(`${r.data.length} devolução(ões) salvas com sucesso!`);
      setLinhas([]);
      qc.invalidateQueries({ queryKey: ['dev'] });
    },
    onError: () => toast.error('Erro ao salvar devoluções'),
  });

  function adicionarLinha() {

    if (!form.nome.trim()) return toast.error('Nome é obrigatório');
    if (form.cpf.length < 14) return toast.error('CPF incompleto');
    if (!munSelecionado) return toast.error('Selecione um município');
    if (!form.memorando.trim()) return toast.error('Memorando é obrigatório');

    if (modo === 'dev' && !form.motivo.trim())
      return toast.error('Motivo é obrigatório');

    const base = {
      nome: form.nome.toUpperCase().trim(),
      cpf: form.cpf,
      unloc: munSelecionado,
      memorando: form.memorando.trim(),
    };

    if (modo === 'inscrenov') {

      const registro: InscRenovRequest = {
        ...base,
        datas: [form.datas],
        descricao: form.descricao,
        urgente: form.urgente,
      };

      setLinhas((prev) => [...prev, registro]);

    } else {

      const registro: DevRequest = {
        ...base,
        datas: [form.datas],
        motivo: form.motivo.trim(),
      };

      setLinhas((prev) => [...prev, registro]);

    }

    setForm((f) => ({
      ...f,
      nome: '',
      cpf: '',
      motivo: '',
      urgente: false,
    }));

  }

  function removerLinha(i: number) {
    setLinhas((prev) => prev.filter((_, idx) => idx !== i));
  }

  function enviar() {

    if (!linhas.length)
      return toast.error('Adicione ao menos um registro');

    if (modo === 'inscrenov')
      enviarInsc.mutate(linhas as InscRenovRequest[]);
    else
      enviarDev.mutate(linhas as DevRequest[]);

  }

  const isSaving = enviarInsc.isPending || enviarDev.isPending;

  return (
    <div className="animate-fade-up">

      <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>
        Adicionar Dados
      </h2>

      <p style={{
        fontSize: '13px',
        color: 'var(--text-muted)',
        marginBottom: '24px'
      }}>
        Preencha os campos, adicione à lista e envie para o banco.
      </p>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '24px'
      }}>

        <button
          onClick={() => {
            setModo('inscrenov');
            setLinhas([]);
          }}
        >
          📄 Inscrição / Renovação
        </button>

        <button
          onClick={() => {
            setModo('dev');
            setLinhas([]);
          }}
        >
          ↩️ Devolução
        </button>

      </div>

      {/* FORM */}

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px'
      }}>

        <label style={lbl}>Nome</label>
        <input
          value={form.nome}
          onChange={(e) => setField('nome', e.target.value.toUpperCase())}
        />

        <label style={lbl}>CPF</label>
        <input
          value={form.cpf}
          inputMode="numeric"
          onChange={(e) => setField('cpf', formatarCPF(e.target.value))}
          placeholder="000.000.000-00"
        />

        <label style={lbl}>Memorando</label>
        <input
          value={form.memorando}
          onChange={(e) => setField('memorando', e.target.value)}
        />

        <button onClick={adicionarLinha}>
          ➕ Adicionar à lista
        </button>

      </div>

      {linhas.length > 0 && (

        <div style={{ marginTop: '20px' }}>

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
                  <td>{l.nome}</td>
                  <td>{l.cpf}</td>
                  <td>{l.unloc}</td>
                  <td>{l.memorando}</td>

                  <td>
                    <button onClick={() => removerLinha(i)}>
                      ✕
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <button
            onClick={enviar}
            disabled={isSaving}
          >
            {isSaving ? 'Salvando...' : '💾 Enviar para BD'}
          </button>

        </div>

      )}

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