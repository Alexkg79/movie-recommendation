'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const loadMovies = async (
    query: string = searchQuery, 
    page: number = currentPage,
    movieFilters: MovieFilters = filters
  ) => {
    setLoading(true);
    try {
      const data = await fetchMoviesWithFilters(query, page, movieFilters);
      setMovies(data.results);
      setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
      setError(null);
    } catch (err) {
      setError('Une erreur est survenue lors du chargement des films.');
      setMovies([]);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (isInitialLoad) {
      loadMovies();
    }
  }, [isInitialLoad]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    loadMovies(query, 1, filters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadMovies(searchQuery, page, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilter = (newFilters: MovieFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    loadMovies(searchQuery, 1, newFilters);
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Recommandations de Films
        </h1>
        
        <SearchBar onSearch={handleSearch} />
        
        <FilterBar onFilter={handleFilter} genres={genres} />
      </motion.div>

      {loading ? (
        <div className="flex justify-center my-12">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1,
              ease: "linear"
            }}
            className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          ></motion.div>
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-6 bg-red-100 rounded-lg text-red-600 max-w-md mx-auto"
        >
          {error}
        </motion.div>
      ) : movies.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-6 bg-blue-50 rounded-lg text-blue-600 max-w-md mx-auto"
        >
          Aucun film trouvé
        </motion.div>
      ) : (
        <>
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {movies.map((movie) => (
                <motion.div 
                  key={movie.id}
                  variants={item}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="movie-card"
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </>
      )}
    </main>
  );
}