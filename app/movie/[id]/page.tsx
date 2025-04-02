'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMovieDetails, fetchMovieCredits, fetchSimilarMovies, fetchMovieVideos } from '../../../lib/tmdb';

interface MovieDetailsPageProps {
  params: {
    id: string;
  };
}

export default function MovieDetail({ params }: MovieDetailsPageProps) {
  const { id } = params;
  const [movie, setMovie] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieData, creditsData, similarData, videosData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieCredits(id),
          fetchSimilarMovies(id),
          fetchMovieVideos(id)
        ]);
        
        setMovie(movieData);
        setCredits(creditsData);
        setSimilarMovies(similarData);
        setVideos(videosData.filter((video: any) => video.site === "YouTube"));
        setError(null);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des détails du film.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
          className="rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"
        ></motion.div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8 text-center"
      >
        <div className="bg-red-100 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-red-700">{error || 'Film non trouvé'}</p>
          <Link 
            href="/" 
            className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    );
  }

  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.jpg';
  
  const backdropPath = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const trailer = videos.find((video: any) => video.type === "Trailer") || videos[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 relative"
    >
      <Link 
        href="/" 
        className="inline-flex items-center mb-6 text-blue-500 hover:text-blue-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Retour aux films
      </Link>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Section Principale */}
        <div className="md:flex items-start">
          {/* Affiche du film */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="w-full md:w-1/3 relative overflow-hidden"
          >
            <Image
              src={imageError ? '/placeholder.jpg' : posterPath}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full h-auto object-cover"
              onError={() => setImageError(true)}
              layout="responsive"
            />
          </motion.div>
          
          {/* Détails du film */}
          <div className="p-6 md:w-2/3">
            <motion.h1 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2 text-gray-800"
            >
              {movie.title}
            </motion.h1>
            
            {movie.tagline && (
              <motion.p 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-gray-600 italic mb-4"
              >
                {movie.tagline}
              </motion.p>
            )}
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {movie.genres?.map((genre: any) => (
                <span 
                  key={genre.id} 
                  className="bg-blue-100 px-3 py-1 text-sm rounded-full text-blue-800"
                >
                  {genre.name}
                </span>
              ))}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center mb-4"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold px-4 py-2 rounded-full mr-4 flex items-center">
                <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </div>
              <span className="text-gray-600">
                {movie.vote_count} votes
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Synopsis</h2>
              <p className="text-gray-700 leading-relaxed">
                {movie.overview || 'Aucune description disponible.'}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <h3 className="font-semibold text-gray-700">Date de sortie</h3>
                <p className="text-gray-600">{movie.release_date ? new Date(movie.release_date).toLocaleDateString('fr-FR') : 'Inconnue'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Durée</h3>
                <p className="text-gray-600">{movie.runtime ? `${movie.runtime} min` : 'Inconnue'}</p>
              </div>
              {movie.budget > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700">Budget</h3>
                  <p className="text-gray-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(movie.budget)}</p>
                </div>
              )}
              {movie.revenue > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700">Revenus</h3>
                  <p className="text-gray-600">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(movie.revenue)}</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Bande-annonce */}
        {trailer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 border-t"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Bande-annonce</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
              <iframe 
                className="w-full h-96"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
        
        {/* Casting */}
        {credits && credits.cast && credits.cast.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="p-6 border-t"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Casting</h2>
            <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
              {credits.cast.slice(0, 10).map((actor: any) => (
                <motion.div 
                  key={actor.id} 
                  whileHover={{ y: -5 }}
                  className="flex-shrink-0 w-36"
                >
                  <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative h-48 w-full">
                      {actor.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                          alt={actor.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-200">
                          <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="font-medium text-sm truncate text-gray-800">{actor.name}</p>
                      <p className="text-xs text-gray-600 truncate">{actor.character}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Films similaires */}
        {similarMovies.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="p-6 border-t"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Films similaires</h2>
            <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
              {similarMovies.slice(0, 10).map((movie) => (
                <motion.div 
                  key={movie.id} 
                  whileHover={{ y: -5 }}
                  className="flex-shrink-0 w-40"
                >
                  <Link href={`/movie/${movie.id}`}>
                    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="relative h-56 w-full">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="font-medium text-sm truncate text-gray-800">{movie.title}</p>
                        <div className="flex items-center mt-1">
                          <svg className="h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs ml-1 text-gray-700">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}