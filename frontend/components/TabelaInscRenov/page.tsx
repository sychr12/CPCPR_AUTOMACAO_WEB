import { InscRenov } from "@/types"

type Props = {
  dados: InscRenov[]
}

export default function TabelaInscRenov({ dados }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Processo</th>
          <th>Data</th>
        </tr>
      </thead>

      <tbody>
        {dados.map((d) => (
          <tr key={d.id}>
            <td>{d.nome}</td>
            <td>{d.cpf}</td>
            <td>{d.processo ?? "-"}</td>
            <td>{d.data}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}