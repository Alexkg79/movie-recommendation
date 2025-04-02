import { useState } from 'react';

// Types pour les filtres
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

  // Générer une liste d'années de 2025 à 1900
  const years = Array.from({ length: 126 }, (_, i) => 2025 - i);
  
  // Options de tri
  const sortOptions = [
    { value: 'popularity.desc', label: 'Popularité ↓' },
    { value: 'popularity.asc', label: 'Popularité ↑' },
    { value: 'vote_average.desc', label: 'Note ↓' },
    { value: 'vote_average.asc', label: 'Note ↑' },
    { value: 'release_date.desc', label: 'Date de sortie ↓' },
    { value: 'release_date.asc', label: 'Date de sortie ↑' },
  ];

  // Gestion des changements de filtres
  const handleFilterChange = (field: keyof MovieFilters, value: any) => {
    const newValue = value === '' ? null : field === 'genre' || field === 'year' || field === 'minRating' ? Number(value) : value;
    setFilters({ ...filters, [field]: newValue });
  };

  // Appliquer les filtres
  const applyFilters = () => {
    onFilter(filters);
  };

  // Réinitialiser les filtres
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
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4 text-black">Filtrer les films</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtre par genre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
          <select
            value={filters.genre || ''}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-gray-400"
          >
            <option value="">Tous les genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Filtre par année */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
          <select
            value={filters.year || ''}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-gray-400"
          >
            <option value="">Toutes les années</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        {/* Filtre par note minimale */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note minimale</label>
          <select
            value={filters.minRating || ''}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-gray-400"
          >
            <option value="">Toutes les notes</option>
            {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ ★
              </option>
            ))}
          </select>
        </div>
        
        {/* Tri */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
          <select
            value={filters.sortBy || 'popularity.desc'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-gray-400"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={resetFilters}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 text-gray-400"
        >
          Réinitialiser
        </button>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}