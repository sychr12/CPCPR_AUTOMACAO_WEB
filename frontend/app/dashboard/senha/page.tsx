'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore'; // ✅ CORREÇÃO

// ── schema ────────────────────────────────────────────────────
const schema = z
  .object({
    senhaAtual: z.string().min(1, 'Senha atual é obrigatória'),
    novaSenha: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirmação é obrigatória'),
  })
  .refine((d) => d.novaSenha === d.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  });

type FormData = z.infer<typeof schema>;

export default function SenhaPage() {

  const usuario = useAuthStore((s) => s.usuario);

  const [showAtual, setShowAtual] = useState(false);
  const [showNova, setShowNova] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const novaSenha = watch('novaSenha', '');

  // ── força da senha ────────────────────────────────────────
  function forca(senha: string) {
    if (!senha) return { nivel: 0, label: '', cor: 'transparent' };

    let pts = 0;

    if (senha.length >= 8) pts++;
    if (senha.length >= 12) pts++;
    if (/[A-Z]/.test(senha)) pts++;
    if (/[0-9]/.test(senha)) pts++;
    if (/[^A-Za-z0-9]/.test(senha)) pts++;

    if (pts <= 1) return { nivel: 1, label: 'Fraca', cor: '#e05252' };
    if (pts <= 3) return { nivel: 2, label: 'Média', cor: '#f5a623' };

    return { nivel: 3, label: 'Forte', cor: '#2FA572' };
  }

  const f = forca(novaSenha);

  // ── mutation ──────────────────────────────────────────────
  const trocar = useMutation({
    mutationFn: (data: FormData) =>
      authApi.trocarSenha({
        senhaAtual: data.senhaAtual,
        novaSenha: data.novaSenha,
      }),

    onSuccess: () => {
      toast.success('Senha alterada com sucesso!');
      reset();
      setConcluido(true);

      setTimeout(() => {
        setConcluido(false);
      }, 4000);
    },

    onError: (err: any) => {
      const msg =
        err?.response?.data?.mensagem ??
        'Erro ao alterar senha';

      toast.error(msg);
    },
  });

  // ── render ────────────────────────────────────────────────
  return (
    <div className="animate-fade-up">

      <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>
        Alterar Senha
      </h2>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '32px',
        }}
      >
        Escolha uma senha segura com pelo menos 6 caracteres.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '440px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >

        {/* ── FORMULÁRIO ── */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '28px',
          }}
        >

          {/* usuário */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '28px',
              padding: '14px',
              background: 'rgba(47,165,114,0.07)',
              border: '1px solid rgba(47,165,114,0.2)',
              borderRadius: '10px',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              👤
            </div>

            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {usuario?.nome ?? 'Usuário'}
              </div>

              <div
                style={{
                  fontSize: '10px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'var(--text-muted)',
                }}
              >
                {usuario?.perfil ?? 'USER'}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit((d) => trocar.mutate(d))}
            noValidate
          >

            {/* senha atual */}
            <InputSenha
              label="Senha Atual"
              register={register('senhaAtual')}
              error={errors.senhaAtual?.message}
              visible={showAtual}
              setVisible={setShowAtual}
            />

            <Divider />

            {/* nova senha */}
            <InputSenha
              label="Nova Senha"
              register={register('novaSenha')}
              error={errors.novaSenha?.message}
              visible={showNova}
              setVisible={setShowNova}
            />

            {/* força */}
            {novaSenha.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    height: '4px',
                    background: 'var(--bg-card2)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${(f.nivel / 3) * 100}%`,
                      height: '100%',
                      background: f.cor,
                    }}
                  />
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'JetBrains Mono',
                    color: f.cor,
                  }}
                >
                  Força: {f.label}
                </span>
              </div>
            )}

            {/* confirmar */}
            <InputSenha
              label="Confirmar Nova Senha"
              register={register('confirmarSenha')}
              error={errors.confirmarSenha?.message}
              visible={showConfirmar}
              setVisible={setShowConfirmar}
            />

            <button
              type="submit"
              disabled={trocar.isPending}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
            >
              {trocar.isPending ? 'Alterando...' : 'Alterar Senha'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

// ── componentes auxiliares ───────────────────────────────────

function InputSenha({
  label,
  register,
  error,
  visible,
  setVisible,
}: any) {
  return (
    <div style={{ marginBottom: '18px' }}>

      <label style={lbl}>{label}</label>

      <div style={{ position: 'relative' }}>
        <input
          type={visible ? 'text' : 'password'}
          {...register}
          style={{ paddingRight: '40px' }}
        />

        <button
          type="button"
          onClick={() => setVisible((v: boolean) => !v)}
          style={olhoStyle}
        >
          {visible ? '🙈' : '👁️'}
        </button>
      </div>

      {error && <p style={erroStyle}>{error}</p>}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: '1px',
        background: 'var(--border)',
        margin: '20px 0',
      }}
    />
  );
}

const lbl: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  fontFamily: 'JetBrains Mono',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '5px',
};

const erroStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#e05252',
  marginTop: '4px',
};

const olhoStyle: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
};