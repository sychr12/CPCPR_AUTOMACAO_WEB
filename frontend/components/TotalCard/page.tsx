type Props = {
  label: string
  valor: number
  cor: string
  icon: string
  loading?: boolean
}

export default function TotalCard({ label, valor, cor, icon, loading }: Props) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '16px'
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginBottom: '6px'
        }}
      >
        {icon} {label}
      </div>

      <div
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: cor
        }}
      >
        {loading ? '...' : valor}
      </div>
    </div>
  )
}