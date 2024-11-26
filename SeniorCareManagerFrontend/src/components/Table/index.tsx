import TableFooter from "./TableFooter";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { JSX, useState } from "react";

interface TableProps {
  columns: string[];
  data: {
    id: number;
  }[];
  actions?: JSX.Element;
}

export default function Table({ columns, data, actions }: TableProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleRowSelection = (rowId: number) => {
    setSelectedRows((prevSelectedRows) => {
      if (!prevSelectedRows) return [rowId];

      if (prevSelectedRows.includes(rowId)) {
        // Se a linha já estiver selecionada, desmarque
        return prevSelectedRows.filter(id => id !== rowId);
      } else {
        // Caso contrário, adicione a linha aos selecionados
        return [...prevSelectedRows, rowId];
      }
    });
  };

  return (
    <table className="w-full bg-neutralWhite rounded-lg shadow-md overflow-hidden">
      {/* Cabeçalho da tabela */}
      <TableHeader columns={columns} actions={actions} />
      {/* Corpo da tabela */}
      <tbody>
        {data.map((row, rowIndex) => (
          <TableRow 
            key={row.id}
            data={row}
            index={rowIndex}
            actions={actions}
            onSelect={handleRowSelection}
            isSelected={selectedRows.includes(row.id)}
          />
        ))}
      </tbody>
      <TableFooter rowsSelected={selectedRows.length} />
    </table>
  );
}
