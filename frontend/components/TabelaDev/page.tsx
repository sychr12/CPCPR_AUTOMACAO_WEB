import { Dev } from '@/types'

type Props = {
  dados: Dev[]
}

export default function TabelaDev({ dados }: Props) {
  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>UNLOC</th>
          <th>Memorando</th>
          <th>Motivo</th>
          <th>Analise</th>
          <th>Envio</th>
        </tr>
      </thead>
      <tbody>
        {dados.map((d) => (
          <tr key={d.id}>
            <td>{d.nome}</td>
            <td>{d.cpf}</td>
            <td>{d.unloc}</td>
            <td>{d.memorando}</td>
            <td>{d.motivo}</td>
            <td>{d.analise ?? '—'}</td>
            <td>
              {d.envio
                ? <span style={{ color: '#2FA572' }}>✅ {d.envio}</span>
                : <span style={{ color: '#f59e0b' }}>⏳ Pendente</span>
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}