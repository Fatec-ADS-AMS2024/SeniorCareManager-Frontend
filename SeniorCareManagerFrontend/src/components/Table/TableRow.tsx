import { Pencil, Trash } from "@phosphor-icons/react";

interface TableRowProps {
  data: any;
  index: number;
}

export default function TableRow({ data, index }: TableRowProps) {
  const keys = Object.keys(data);

  return (
    <tr 
      tabIndex={index + 1}
      className={`border-y text-textSecondary h-12 ${
        index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
      }`}
    >
      {/* Célula da checkbox */}
      <td className="flex items-center justify-center">
        <input type="checkbox" className="cursor-pointer h-full" />
      </td>
      {/* Conteúdo */}
      {keys.map((value, index) => {
        if (index > 0)
          return (
            <td key={data[value]} className="px-4">
              {data[value]}
            </td>
          )
      })} 
      {/* Célula dos botões */}
      <td className="px-4 text-center flex justify-center border-l-2 h-full">
        <div className="flex justify-evenly max-w-56 w-full">
          <button className="text-[#5DB6DC] hover:text-[#42a2cc]">
            <Pencil size={24} weight="fill" />
          </button>
          <button className="text-red-500 hover:text-red-700">
            <Trash size={24} weight="fill" />
          </button>
        </div>
      </td>
    </tr>
  );
}
