// ═══════════════════════════════════════════════════
// SENHA — senha/page.tsx
// ═══════════════════════════════════════════════════
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi, useAuthStore } from '@/lib/api';

const schema = z.object({
  senhaAtual:     z.string().min(1, 'Senha atual é obrigatória'),
  novaSenha:      z.string().min(6, 'Mínimo 6 caracteres'),
  confirmarSenha: z.string().min(1, 'Confirmação obrigatória'),
}).refine(d => d.novaSenha === d.confirmarSenha, { message: 'Senhas não coincidem', path: ['confirmarSenha'] });

type FormData = z.infer<typeof schema>;

function forca(senha: string) {
  if (!senha) return { nivel: 0, label: '', cor: 'transparent', pct: 0 };
  let pts = 0;
  if (senha.length >= 8) pts++;
  if (senha.length >= 12) pts++;
  if (/[A-Z]/.test(senha)) pts++;
  if (/[0-9]/.test(senha)) pts++;
  if (/[^A-Za-z0-9]/.test(senha)) pts++;
  if (pts <= 1) return { nivel: 1, label: 'Fraca',  cor: '#c53030', pct: 33 };
  if (pts <= 3) return { nivel: 2, label: 'Média',  cor: '#d97706', pct: 66 };
  return              { nivel: 3, label: 'Forte',  cor: '#009c46', pct: 100 };
}

export default function SenhaPage() {
  const usuario = useAuthStore(s => s.usuario);
  const [showAtual,     setShowAtual]     = useState(false);
  const [showNova,      setShowNova]      = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const novaSenha = watch('novaSenha', '');
  const f = forca(novaSenha);

  const trocar = useMutation({
    mutationFn: (d: FormData) => authApi.trocarSenha({ senhaAtual: d.senhaAtual, novaSenha: d.novaSenha }),
    onSuccess: () => { toast.success('Senha alterada!'); reset(); },
    onError: (e: any) => toast.error(e?.response?.data?.mensagem ?? 'Erro ao alterar senha'),
  });

  return (
    <>
      <style>{`
        .senha-layout { display: grid; grid-template-columns: 440px 1fr; gap: 24px; align-items: start; }
        @media (max-width: 700px) { .senha-layout { grid-template-columns: 1fr; } }
        .senha-card { background: var(--bg-card); border: 1.5px solid var(--border); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-sm); }
        .user-banner { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: var(--radius); margin-bottom: 24px; }
        .user-avatar { width: 42px; height: 42px; border-radius: 50%; background: var(--gov-navy); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; flex-shrink: 0; }
        .user-nome { font-family: 'Teko',sans-serif; font-size: 18px; font-weight: 700; color: var(--gov-navy); line-height: 1; }
        .user-perfil { font-size: 11px; color: #4b72bb; font-family: 'Teko',monospace; letter-spacing: 1px; margin-top: 2px; }
        .campo-senha { margin-bottom: 18px; }
        .campo-senha-wrap { position: relative; }
        .campo-senha-wrap input { padding-right: 42px; }
        .olho-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; opacity: 0.5; transition: opacity 0.15s; }
        .olho-btn:hover { opacity: 0.8; }
        .campo-erro { font-size: 11px; color: var(--gov-red); margin-top: 4px; }
        .forca-bar { height: 4px; background: var(--bg); border-radius: 2px; overflow: hidden; margin-top: 6px; margin-bottom: 4px; }
        .forca-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
        .forca-label { font-size: 11px; font-family: 'Teko',monospace; letter-spacing: 1px; }
        .divisor { height: 1px; background: var(--border); margin: 18px 0; }
        .dica-card { background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: var(--radius-lg); padding: 20px; }
        .dica-titulo { font-family: 'Teko',sans-serif; font-size: 16px; font-weight: 700; color: var(--gov-green-dark); margin-bottom: 12px; letter-spacing: 0.5px; }
        .dica-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #166534; margin-bottom: 8px; }
      `}</style>
      <div className="animate-fade-up">
        <div className="page-header">
          <div><h2 className="page-titulo">Alterar Senha</h2><p className="page-subtitulo">Escolha uma senha segura com pelo menos 6 caracteres.</p></div>
        </div>
        <div className="senha-layout">
          <div className="senha-card">
            <div className="user-banner">
              <div className="user-avatar">👤</div>
              <div><div className="user-nome">{usuario?.nome ?? 'Usuário'}</div><div className="user-perfil">{usuario?.perfil ?? 'USER'}</div></div>
            </div>
            <form onSubmit={handleSubmit(d => trocar.mutate(d))} noValidate>
              <div className="campo-senha">
                <label className="campo-label">Senha Atual</label>
                <div className="campo-senha-wrap">
                  <input type={showAtual ? 'text' : 'password'} {...register('senhaAtual')} />
                  <button type="button" className="olho-btn" onClick={() => setShowAtual(v => !v)}>{showAtual ? '🙈' : '👁️'}</button>
                </div>
                {errors.senhaAtual && <p className="campo-erro">{errors.senhaAtual.message}</p>}
              </div>
              <div className="divisor" />
              <div className="campo-senha">
                <label className="campo-label">Nova Senha</label>
                <div className="campo-senha-wrap">
                  <input type={showNova ? 'text' : 'password'} {...register('novaSenha')} />
                  <button type="button" className="olho-btn" onClick={() => setShowNova(v => !v)}>{showNova ? '🙈' : '👁️'}</button>
                </div>
                {errors.novaSenha && <p className="campo-erro">{errors.novaSenha.message}</p>}
                {novaSenha && (
                  <>
                    <div className="forca-bar"><div className="forca-fill" style={{ width: `${f.pct}%`, background: f.cor }} /></div>
                    <span className="forca-label" style={{ color: f.cor }}>Força: {f.label}</span>
                  </>
                )}
              </div>
              <div className="campo-senha">
                <label className="campo-label">Confirmar Nova Senha</label>
                <div className="campo-senha-wrap">
                  <input type={showConfirmar ? 'text' : 'password'} {...register('confirmarSenha')} />
                  <button type="button" className="olho-btn" onClick={() => setShowConfirmar(v => !v)}>{showConfirmar ? '🙈' : '👁️'}</button>
                </div>
                {errors.confirmarSenha && <p className="campo-erro">{errors.confirmarSenha.message}</p>}
              </div>
              <button type="submit" className="btn-primary btn" style={{ width: '100%', marginTop: 8 }} disabled={trocar.isPending}>
                {trocar.isPending ? '⏳ Alterando...' : '🔒 Alterar Senha'}
              </button>
            </form>
          </div>
          <div className="dica-card">
            <div className="dica-titulo">🔐 Dicas de Segurança</div>
            {['Use pelo menos 8 caracteres','Inclua letras maiúsculas e minúsculas','Adicione números e símbolos (!@#$)','Não reutilize senhas antigas','Não compartilhe sua senha'].map(d => (
              <div key={d} className="dica-item"><span>✅</span><span>{d}</span></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
