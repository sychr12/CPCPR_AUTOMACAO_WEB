import { Dev } from "@/types"

type Props = {
  dados: Dev[]
}

export default function TabelaDev({ dados }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Processo</th>
          <th>Valor</th>
        </tr>
      </thead>

      <tbody>
        {dados.map((d) => (
          <tr key={d.id}>
            <td>{d.nome}</td>
            <td>{d.cpf}</td>
            <td>{d.processo}</td>
            <td>{d.valor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}