import { useState } from "react";

interface TablePaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({
  totalPages,
  currentPage,
  onPageChange,
}: TablePaginationProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleSelectPage = (page: number) => {
    onPageChange(page);
    setShowDropdown(false);
  };

  const renderDropdown = () => (
    <div
      className="absolute top-full mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10"
      onClick={() => setShowDropdown(false)}
    >
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
            page === currentPage ? "bg-gray-200 font-bold" : ""
          }`}
          onClick={() => handleSelectPage(page)}
        >
          Página {page}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex items-center justify-center mt-4">
      {/* Botão Anterior */}
      <button
        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        disabled={currentPage === 1}
        onClick={handlePrevious}
      >
        Anterior
      </button>

      {/* Dropdown de seleção de página */}
      <div className="relative mx-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Página {currentPage} de {totalPages}
        </button>
        {showDropdown && renderDropdown()}
      </div>

      {/* Botão Próximo */}
      <button
        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        disabled={currentPage === totalPages}
        onClick={handleNext}
      >
        Próximo
      </button>
    </div>
  );
}
