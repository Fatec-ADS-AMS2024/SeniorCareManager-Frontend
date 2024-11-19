interface TableHeaderProps {
  columns: string[];
}

export default function TableHeader({ columns }: TableHeaderProps) {
  return (
    <thead className="bg-[#FAFAFA] text-textPrimary">
      <tr className="h-12">
        <th
          className={`h-full flex w-10`}
        >
        </th>
        {columns.map((column, index) => (
          <th
            key={index}
            className={`h-full flex ${
              index === columns.length - 1 ? "text-center" : "text-left"
            } ${index === 0 ? "w-10" : ""}`}
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}
