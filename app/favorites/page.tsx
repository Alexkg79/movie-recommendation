'use client';

import { useEffect, useState } from 'react';
import MovieCard from '../../components/MovieCard';
import { fetchMovieDetails } from '../../lib/tmdb';
import useFavorites from '../../hooks/useFavorites';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Favorites IDs:', favorites); // Debug
    
    const loadMovies = async () => {
      try {
        if (favorites.length === 0) {
          setMovies([]);
          return;
        }

        setLoading(true);
        setError(null);
        
        const results = await Promise.allSettled(
          favorites.map(id => fetchMovieDetails(id.toString()))
        );

        const loadedMovies = results
          .filter(result => result.status === 'fulfilled' && result.value)
          .map(result => (result as PromiseFulfilledResult<any>).value);

        console.log('Loaded movies:', loadedMovies); // Debug
        
        if (loadedMovies.length !== favorites.length) {
          console.warn('Certains films n\'ont pas pu être chargés');
        }

        setMovies(loadedMovies);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Erreur de chargement des favoris');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [favorites]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Mes Films Favoris{favorites.length > 0 && ` (${favorites.length})`}
      </h1>

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-300">
          <p className="text-lg mb-4">
            {favorites.length > 0
              ? "Les films n'ont pas pu être chargés"
              : "Vous n'avez aucun film favori"}
          </p>
          <a href="/" className="text-blue-400 hover:underline">
            Explorer les films
          </a>
        </div>
      )}
    </div>
  );
}