import { useState } from 'react';
import { motion } from 'framer-motion';

export interface MovieFilters {
  year?: number | null;
  genre?: number | null;
  minRating?: number | null;
  sortBy?: string | null;
}

interface FilterBarProps {
  onFilter: (filters: MovieFilters) => void;
  genres: { id: number; name: string }[];
}

export default function FilterBar({ onFilter, genres }: FilterBarProps) {
  const [filters, setFilters] = useState<MovieFilters>({
    year: null,
    genre: null,
    minRating: null,
    sortBy: 'popularity.desc'
  });

  const years = Array.from({ length: 126 }, (_, i) => 2025 - i);
  
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularité ↓' },
    { value: 'popularity.asc', label: 'Popularité ↑' },
    { value: 'vote_average.desc', label: 'Note ↓' },
    { value: 'vote_average.asc', label: 'Note ↑' },
    { value: 'release_date.desc', label: 'Date de sortie ↓' },
    { value: 'release_date.asc', label: 'Date de sortie ↑' },
  ];

  const handleFilterChange = (field: keyof MovieFilters, value: any) => {
    const newValue = value === '' ? null : field === 'genre' || field === 'year' || field === 'minRating' ? Number(value) : value;
    setFilters({ ...filters, [field]: newValue });
  };

  const applyFilters = () => {
    onFilter(filters);
  };

  const resetFilters = () => {
    const resetFilters = {
      year: null,
      genre: null,
      minRating: null,
      sortBy: 'popularity.desc'
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-xl shadow-lg mb-8"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800">Filtrer les films</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtre par genre */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
          <select
            value={filters.genre || ''}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </motion.div>
        
        {/* Filtre par année */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
          <select
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Toutes les années</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </motion.div>
        
        {/* Filtre par note minimale */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note minimale</label>
          <select
            value={filters.minRating || ''}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Toutes les notes</option>
            {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ ★
              </option>
            ))}
          </select>
        </motion.div>
        
        {/* Tri */}
        <motion.div whileHover={{ scale: 1.02 }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
          <select
            value={filters.sortBy || 'popularity.desc'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </motion.div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetFilters}
          className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 text-gray-600 transition-all"
        >
          Réinitialiser
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={applyFilters}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
        >
          Appliquer
        </motion.button>
      </div>
    </motion.div>
  );
}