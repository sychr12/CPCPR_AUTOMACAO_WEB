'use client';

export default function CarteiraDigitalPage() {
  return (
    <div className="animate-fade-up">

      <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Carteira Digital</h2>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
        Emissão de carteiras digitais do produtor rural.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* status card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(245,166,35,0.35)',
            borderRadius: '12px',
            padding: '22px',
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(245,166,35,0.12)',
              border: '1px solid rgba(245,166,35,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            ⚙️
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f5a623', marginBottom: '6px' }}>
              Automação necessária
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              A emissão de carteiras digitais utiliza automação via{' '}
              <span style={{ color: '#ddd', fontFamily: 'JetBrains Mono, monospace' }}>
                Selenium
              </span>{' '}
              integrada ao sistema da SEFA-AM. É necessário que o serviço de automação
              esteja configurado e ativo no servidor.
            </p>
          </div>
        </div>

        {/* requisitos card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '22px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
            Requisitos do servidor
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { icon: '🌐', label: 'Google Chrome', desc: 'versão 120+' },
              { icon: '🤖', label: 'ChromeDriver', desc: 'compatível com o Chrome instalado' },
              { icon: '🐍', label: 'Python + Selenium', desc: 'pip install selenium' },
              { icon: '🔐', label: 'Credenciais SEFA-AM', desc: 'acesso ao portal' },
              { icon: '🖥️', label: 'Modo headless', desc: 'recomendado em servidor' },
            ].map(({ icon, label, desc }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12px',
                }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{icon}</span>
                <div>
                  <span style={{ color: '#ccc', fontWeight: 600 }}>{label}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>
                    {desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* fluxo visual */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <p className="section-title" style={{ marginBottom: '20px' }}>
          Fluxo de emissão
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: '🔍', label: 'Buscar produtor por CPF' },
            { icon: '🌐', label: 'Abrir portal SEFA-AM' },
            { icon: '📋', label: 'Preencher formulário' },
            { icon: '🖨️', label: 'Gerar PDF da carteira' },
            { icon: '💾', label: 'Salvar no sistema' },
          ].map((step, i, arr) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 12px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(47,165,114,0.1)',
                    border: '1px solid rgba(47,165,114,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  {step.icon}
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    maxWidth: '80px',
                    lineHeight: 1.4,
                  }}
                >
                  {step.label}
                </span>
              </div>

              {i < arr.length - 1 && (
                <div
                  style={{
                    width: '32px',
                    height: '1px',
                    background:
                      'linear-gradient(to right, rgba(47,165,114,0.4), rgba(47,165,114,0.1))',
                    marginBottom: '20px',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* nota */}
      <div
        style={{
          padding: '14px 18px',
          background: 'rgba(47,165,114,0.06)',
          border: '1px solid rgba(47,165,114,0.2)',
          borderRadius: '10px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: 1.7,
        }}
      >
        ℹ️ Para ativar esta funcionalidade, configure o serviço de automação no backend em{' '}
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--green)',
          }}
        >
          CPCPR_AUTOMACAO/backend/src/main/java/com/cpcpr/carteira/service/SeleniumService.java
        </span>
      </div>
    </div>
  );
}