'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-red-700">{error || 'Film non trouvé'}</p>
          <Link href="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.jpg';
  
  const backdropPath = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  // Trouve la bande-annonce si disponible
  const trailer = videos.find((video: any) => video.type === "Trailer") || videos[0];

  return (
      <div className="container mx-auto px-4 py-8 relative">
        <Link href="/" className="inline-block mb-6 text-blue-500 hover:underline">
          &larr; Retour aux films
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex items-start">
            {/* Affichage de l'affiche en entier */}
            <div className="w-full md:w-1/3 relative overflow-hidden">
              <Image
                src={imageError ? '/placeholder.jpg' : posterPath}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-auto object-cover"
                onError={() => setImageError(true)}
                layout="responsive"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <h1 className="text-3xl font-bold mb-2 text-gray-700">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-gray-600 italic mb-4">{movie.tagline}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((genre: any) => (
                  <span key={genre.id} className="bg-gray-200 px-2 py-1 text-sm rounded text-gray-700">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center mb-4">
                <div className="bg-yellow-400 text-yellow-900 font-bold px-3 py-1 rounded-full mr-4">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                </div>
                <span className="text-gray-600">
                  {movie.vote_count} votes
                </span>
              </div>
              
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Synopsis</h2>
                <p className="text-gray-700">{movie.overview || 'Aucune description disponible.'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Date de sortie</h3>
                  <p className="text-gray-500">{movie.release_date ? new Date(movie.release_date).toLocaleDateString('fr-FR') : 'Inconnue'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Durée</h3>
                  <p className="text-gray-500">{movie.runtime ? `${movie.runtime} min` : 'Inconnue'}</p>
                </div>
                {movie.budget > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Budget</h3>
                    <p className="text-gray-500">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(movie.budget)}</p>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700">Revenus</h3>
                    <p className="text-gray-500">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(movie.revenue)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Section Bande-annonce */}
          {trailer && (
            <div className="p-6 border-t">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">Bande-annonce</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  className="w-full h-96"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          
          {/* Section Casting */}
          {credits && credits.cast && credits.cast.length > 0 && (
            <div className="p-6 border-t">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">Casting</h2>
              <div className="flex overflow-x-auto pb-4 space-x-4">
                {credits.cast.slice(0, 10).map((actor: any) => (
                  <div key={actor.id} className="flex-shrink-0 w-36">
                    <div className="bg-gray-200 rounded-lg overflow-hidden">
                      <div className="relative h-48 w-full">
                        {actor.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-300 ">
                            <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="font-medium text-sm truncate text-gray-700">{actor.name}</p>
                        <p className="text-xs text-gray-500 truncate">{actor.character}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Films similaires */}
          {similarMovies.length > 0 && (
            <div className="p-6 border-t">
              <h2 className="text-2xl font-bold mb-4 text-gray-700">Films similaires</h2>
              <div className="flex overflow-x-auto pb-4 space-x-4">
                {similarMovies.slice(0, 10).map((movie) => (
                  <div key={movie.id} className="flex-shrink-0 w-40">
                    <Link href={`/movie/${movie.id}`}>
                      <div className="bg-gray-200 rounded-lg overflow-hidden">
                        <div className="relative h-56 w-full">
                          {movie.poster_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                              alt={movie.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-300">
                              <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="font-medium text-sm truncate text-gray-700">{movie.title}</p>
                          <div className="flex items-center mt-1">
                            <svg className="h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs ml-1 text-gray-700">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    
  );
}