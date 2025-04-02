'use client';

import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import FilterBar, { MovieFilters } from '../components/FilterBar';
import Pagination from '../components/Pagination';
import { fetchGenres, fetchMoviesWithFilters } from '../lib/tmdb';

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<MovieFilters>({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Charger les genres une seule fois au démarrage
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genresData = await fetchGenres();
        setGenres(genresData);
      } catch (err) {
        console.error('Erreur lors du chargement des genres:', err);
      }
    };
    
    loadGenres();
  }, []);

  // Charger les films avec ou sans filtres
  const loadMovies = async (
    query: string = searchQuery, 
    page: number = currentPage,
    movieFilters: MovieFilters = filters
  ) => {
    setLoading(true);
    try {
      const data = await fetchMoviesWithFilters(query, page, movieFilters);
      setMovies(data.results);
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB limite à 500 pages
      setError(null);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des films.');
      setMovies([]);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Premier chargement des films tendances
  useEffect(() => {
    if (isInitialLoad) {
      loadMovies();
    }
  }, [isInitialLoad]);

  // Gestion de la recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    loadMovies(query, 1, filters);
  };

  // Gestion du changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadMovies(searchQuery, page, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gestion des filtres
  const handleFilter = (newFilters: MovieFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    loadMovies(searchQuery, 1, newFilters);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Recommandations de Films</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      <FilterBar onFilter={handleFilter} genres={genres} />
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4 my-8">{error}</div>
      ) : movies.length === 0 ? (
        <div className="text-center p-4 my-8">Aucun film trouvé</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}