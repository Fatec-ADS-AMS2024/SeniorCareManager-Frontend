interface TableRowProps<T extends { id: number }> {
  data: T;
  index: number;
  actions?: JSX.Element;
  onSelect: (rowId: number) => void;
  isSelected: boolean;
}

export default function TableRow<T extends { id: number }>({
  data,
  index,
  actions,
  onSelect,
  isSelected,
}: TableRowProps<T>) {
  const values = Object.values(data);

  const handleClick = () => {
    onSelect(data.id);
  };

  return (
    <tr
      className={`border-y text-textSecondary h-12 ${
        index % 2 === 1 ? 'bg-neutralWhite' : 'bg-neutralLighter'
      }`}
    >
      {/* Célula da checkbox */}
      <td>
        <div className='h-full flex items-center justify-center'>
          <input
            type='checkbox'
            className='cursor-pointer'
            checked={isSelected}
            onChange={handleClick}
          />
        </div>
      </td>

      {/* Conteúdo */}
      {values.map((value, index) => {
        if (index > 0) return <td key={`Table_${value}`}>{value}</td>;
      })}

      {/* Célula dos botões */}
      {actions && (
        <td className='px-4 text-center border-l-2 h-full'>
          <div className='flex h-full justify-evenly items-center'>
            {actions}
          </div>
        </td>
      )}
    </tr>
  );
}
