interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 text-black"
        >
          Précédent
        </button>
        
        <span className="px-4 py-2">
          Page {currentPage} sur {totalPages || 1}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 text-black"
        >
          Suivant
        </button>
      </div>
    );
  }