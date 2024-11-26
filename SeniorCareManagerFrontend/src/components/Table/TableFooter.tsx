interface TableFooterProps {
    rowsSelected: number;
}

export default function TableFooter({ rowsSelected }: TableFooterProps) {
    return (
        <tfoot className="text-textPrimary bg-neutral">
            {/* Aqui ficará a parte de paginação */}
            <tr className="h-12">
                <td colSpan={99}>
                    <div className="flex items-center px-4 justify-between h-12">
                        <p>Linhas selecionadas: {rowsSelected}</p>
                        <span>Paginação</span>
                    </div>
                </td>
            </tr>
        </tfoot>
    )    
}