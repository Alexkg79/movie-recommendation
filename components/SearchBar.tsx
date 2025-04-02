import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{
            boxShadow: isFocused 
              ? '0 10px 25px -5px rgba(59, 130, 246, 0.2)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          className="relative flex items-center bg-white rounded-full transition-all"
        >
          <div className="absolute left-5 text-gray-400">
            <FiSearch className="h-5 w-5" />
          </div>
          
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full py-3 pl-12 pr-10 rounded-full border-none focus:outline-none focus:ring-0 bg-transparent text-gray-700 placeholder-gray-400"
          />
          
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                onClick={clearSearch}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full focus:outline-none"
                aria-label="Clear search"
              >
                <FiX className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute right-2 px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              query.trim() 
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!query.trim()}
          >
            Go
          </motion.button>
        </motion.div>
      </form>
      
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-gray-500 mt-2 ml-4"
          >
            Appuyez sur Entrée pour rechercher
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}