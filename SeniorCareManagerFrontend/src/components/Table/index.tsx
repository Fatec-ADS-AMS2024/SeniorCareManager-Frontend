import { Plus } from "@phosphor-icons/react";
import IconButton from "../Button";
import TableFooter from "./TableFooter";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

interface TableProps {
  columns: string[];
  data: {
    id: number;
  }[];
}

export default function Table({ columns, data }: TableProps) {
  return (
    <table className="w-full border-2 border-red-500 rounded-lg shadow-md">
      {/* Cabeçalho da tabela */}
      <TableHeader columns={columns} />
      {/* Corpo da tabela */}
      <tbody>
        {data.map((row, rowIndex) => (
          <TableRow key={row.id} data={row} index={rowIndex} />
        ))}
      </tbody>
      <TableFooter />
      <IconButton color="danger" label="Cadastrar" icon={<Plus />} size="large"/>
    </table>
  );
}
