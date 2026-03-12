import { InscRenov } from '@/types'

type Props = {
  dados: InscRenov[]
}

export default function TabelaInscRenov({ dados }: Props) {
  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>UNLOC</th>
          <th>Memorando</th>
          <th>Tipo</th>
          <th>Datas</th>
          <th>Análise</th>
          <th>Lançado</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((d) => (
          <tr key={d.id}>
            <td>{d.nome}</td>
            <td>{d.cpf}</td>
            <td>{d.unloc}</td>
            <td>{d.memorando}</td>
            <td>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  background: d.descricao === 'INSC' ? '#1a4a2e' : '#1a2a4a',
                  color: d.descricao === 'INSC' ? '#2FA572' : '#4a9eff',
                }}
              >
                {d.descricao}
              </span>
            </td>
            <td>{d.datas ?? '—'}</td>
            <td>{d.analise ?? '—'}</td>
            <td>
              {d.lancou
                ? <span style={{ color: '#2FA572' }}>✅ {d.lancou}</span>
                : <span style={{ color: '#f5a623' }}>⏳ Pendente</span>
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}