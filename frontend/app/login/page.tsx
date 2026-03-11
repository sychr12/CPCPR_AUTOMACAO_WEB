'use client';

import { useState }       from 'react';
import { useRouter }      from 'next/navigation';
import { useForm }        from 'react-hook-form';
import { zodResolver }    from '@hookform/resolvers/zod';
import { z }              from 'zod';
import toast              from 'react-hot-toast';
import { authApi }        from '@/lib/api';
import { useAuthStore }   from '@/lib/api';

// ── schema ───────────────────────────────────────────────────
const schema = z.object({
  nome:  z.string().min(1, 'Nome é obrigatório'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

type FormData = z.infer<typeof schema>;

// ── componente ───────────────────────────────────────────────
export default function LoginPage() {
  const router  = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      setAuth(res.data);
      toast.success(`Bem-vindo, ${res.data.nome}!`);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.mensagem ?? 'Usuário ou senha inválidos';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight:       '100vh',
        background:      'var(--bg)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        position:        'relative',
        overflow:        'hidden',
      }}
    >
      {/* grade de fundo */}
      <div
        style={{
          position:        'fixed',
          inset:           0,
          backgroundImage: `
            linear-gradient(rgba(47,165,114,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(47,165,114,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          pointerEvents:  'none',
        }}
      />

      {/* brilho verde inferior-esquerdo */}
      <div
        style={{
          position:     'fixed',
          bottom:       '-120px',
          left:         '-120px',
          width:        '500px',
          height:       '500px',
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(47,165,114,0.12) 0%, transparent 70%)',
          pointerEvents:'none',
        }}
      />

      {/* brilho verde superior-direito */}
      <div
        style={{
          position:     'fixed',
          top:          '-80px',
          right:        '-80px',
          width:        '360px',
          height:       '360px',
          borderRadius: '50%',
          background:   'radial-gradient(circle, rgba(47,165,114,0.08) 0%, transparent 70%)',
          pointerEvents:'none',
        }}
      />

      {/* CARD LOGIN */}
      <div
        className="animate-fade-up"
        style={{
          position:     'relative',
          zIndex:       1,
          width:        '100%',
          maxWidth:     '400px',
          margin:       '0 16px',
          background:   'var(--bg-card)',
          border:       '1px solid var(--border)',
          borderRadius: '16px',
          padding:      '40px 36px',
          boxShadow:    '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* logo / título */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width:        '52px',
              height:       '52px',
              borderRadius: '14px',
              background:   'var(--green)',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              fontSize:     '26px',
              margin:       '0 auto 16px',
              boxShadow:    '0 0 24px rgba(47,165,114,0.35)',
            }}
          >
            🌿
          </div>

          <h1 style={{ fontSize: '20px', marginBottom: '4px', color: '#fff' }}>
            Carteira do Produtor Rural
          </h1>
          <p
            style={{
              fontSize:    '11px',
              color:       'var(--text-muted)',
              fontFamily:  'JetBrains Mono, monospace',
              letterSpacing: '2px',
            }}
          >
            CPCPR — ACESSO RESTRITO
          </p>
        </div>

        {/* formulário */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* campo nome */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="nome"
              style={{
                display:      'block',
                fontSize:     '11px',
                fontFamily:   'JetBrains Mono, monospace',
                letterSpacing:'1.5px',
                color:        'var(--text-muted)',
                marginBottom: '6px',
                textTransform:'uppercase',
              }}
            >
              Nome de usuário
            </label>
            <input
              id="nome"
              type="text"
              autoComplete="username"
              autoFocus
              {...register('nome')}
              placeholder="seu.nome"
              style={{
                borderColor: errors.nome ? '#e05252' : undefined,
              }}
            />
            {errors.nome && (
              <p style={{ fontSize: '11px', color: '#e05252', marginTop: '4px' }}>
                {errors.nome.message}
              </p>
            )}
          </div>

          {/* campo senha */}
          <div style={{ marginBottom: '28px' }}>
            <label
              htmlFor="senha"
              style={{
                display:      'block',
                fontSize:     '11px',
                fontFamily:   'JetBrains Mono, monospace',
                letterSpacing:'1.5px',
                color:        'var(--text-muted)',
                marginBottom: '6px',
                textTransform:'uppercase',
              }}
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              autoComplete="current-password"
              {...register('senha')}
              placeholder="••••••••"
              style={{
                borderColor: errors.senha ? '#e05252' : undefined,
              }}
            />
            {errors.senha && (
              <p style={{ fontSize: '11px', color: '#e05252', marginTop: '4px' }}>
                {errors.senha.message}
              </p>
            )}
          </div>

          {/* botão */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '11px', fontSize: '14px' }}
          >
            {loading ? (
              <>
                <Spinner />
                Entrando…
              </>
            ) : (
              'Entrar'
            )}
          </button>

        </form>

        {/* rodapé */}
        <p
          style={{
            textAlign:  'center',
            marginTop:  '24px',
            fontSize:   '10px',
            color:      'var(--text-muted)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          SEFA — Secretaria de Estado da Fazenda do Amazonas
        </p>
      </div>
    </main>
  );
}

// ── spinner inline ────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      style={{ animation: 'spin 0.7s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}