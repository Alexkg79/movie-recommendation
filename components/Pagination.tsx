import { motion } from 'framer-motion';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-center mt-8 space-x-3">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 transition-all"
            >
                Précédent
            </motion.button>
            
            <motion.span 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg font-medium"
            >
                Page {currentPage} sur {totalPages || 1}
            </motion.span>
            
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 transition-all"
            >
                Suivant
            </motion.button>
        </div>
    );
}