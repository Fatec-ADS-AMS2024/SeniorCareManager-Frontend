import { useState } from "react";
import TablePagination from "./TablePagination";

interface TableFooterProps {
    rowsSelected: number;
    totalPages: number;
}

export default function TableFooter({ rowsSelected, totalPages }: TableFooterProps) {
    const [currentPage, setCurrentPage] = useState(1);

    // Função para mudar de página
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        console.log("Página atual:", page); // Pode ser usado para outras ações, como recarregar dados
    };

    return (
        <tfoot className="text-textPrimary bg-neutral">
            {/* Parte de paginação */}
            <tr className="h-12">
                <td colSpan={99}>
                    <div className="flex items-center px-4 justify-between h-12">
                        <p>Linhas selecionadas: {rowsSelected}</p>
                        <TablePagination
                            totalPages={totalPages}  // Total de páginas, pode ser dinâmico conforme seus dados
                            currentPage={currentPage}
                            onPageChange={handlePageChange}  // Passa a função de mudança de página
                        />
                    </div>
                </td>
            </tr>
        </tfoot>
    );
}
