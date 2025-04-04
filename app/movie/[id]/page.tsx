'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiPlay, FiImage, FiYoutube, FiArrowLeft } from 'react-icons/fi';
import { fetchMovieDetails, fetchMovieCredits, fetchSimilarMovies, fetchMovieVideos } from '../../../lib/tmdb';
import useFavorites from '../../../hooks/useFavorites';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface MovieDetailsPageProps {
  params: {
    id: string;
  };
}

interface MediaItem {
  type: 'video' | 'image';
  url: string;
  title?: string;
}

interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

interface Image {
  file_path: string;
  width?: number;
  height?: number;
}

export default function MovieDetail({ params }: MovieDetailsPageProps) {
  const { id } = params;
  const [movie, setMovie] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [media, setMedia] = useState<{
    videos: Video[];
    images: Image[];
  }>({ videos: [], images: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'trailers' | 'photos'>('trailers');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieData, creditsData, similarData, videosData, imagesData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieCredits(id),
          fetchSimilarMovies(id),
          fetchMovieVideos(id),
          fetch(`https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`)
            .then(res => res.json())
        ]);
        
        setMovie(movieData);
        setCredits(creditsData);
        setSimilarMovies(similarData);
        
        // Filtrage des médias
        const filteredVideos = videosData.filter((video: Video) => 
          ['YouTube', 'Vimeo'].includes(video.site)
        );
        
        const filteredImages = imagesData.backdrops || [];
        
        setMedia({
          videos: filteredVideos,
          images: filteredImages
        });
        
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
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
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
        />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
        <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-center">
          <p className="text-red-400 mb-4">{error || 'Film non trouvé'}</p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.jpg';

  const trailer = media.videos.find((video: Video) => video.type === "Trailer") || media.videos[0];

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Header */}
      <div className="container mx-auto px-4 pt-6">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Retour aux films
        </Link>
      </div>

      {/* Bouton Favoris */}
      <motion.button
        onClick={() => toggleFavorite(parseInt(id))}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-20 right-6 z-50 p-3 bg-gray-800/90 backdrop-blur-md rounded-full shadow-lg hover:bg-red-500/90 transition-all duration-200 group"
        aria-label={isFavorite(parseInt(id)) ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <FiHeart 
          className={`h-6 w-6 transition-colors ${
            isFavorite(parseInt(id))
              ? 'fill-red-500 text-red-500 group-hover:fill-red-400 group-hover:text-red-400'
              : 'text-gray-300 group-hover:text-white'
          }`}
        />
      </motion.button>

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6"
      >
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Section Principale */}
          <div className="md:flex">
            {/* Affiche du film */}
            <div className="w-full md:w-1/3 relative">
              <Image
                src={imageError ? '/placeholder.jpg' : posterPath}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-auto object-cover"
                onError={() => setImageError(true)}
                priority
              />
            </div>
            
            {/* Détails du film */}
            <div className="p-6 md:w-2/3">
              <motion.h1 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl font-bold mb-2"
              >
                {movie.title}
                {movie.release_date && (
                  <span className="text-gray-400 ml-2">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                )}
              </motion.h1>
              
              {movie.tagline && (
                <p className="text-gray-400 italic mb-4">
                  {movie.tagline}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres?.map((genre: any) => (
                  <span 
                    key={genre.id} 
                    className="bg-blue-900/50 text-blue-300 px-3 py-1 text-sm rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center mb-6">
                <div className="bg-yellow-500/90 text-yellow-900 font-bold px-4 py-2 rounded-full mr-4 flex items-center">
                  <span className="mr-1">★</span>
                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  <span className="text-gray-300 text-sm ml-2">
                    ({movie.vote_count} votes)
                  </span>
                </div>
                {movie.runtime && (
                  <span className="text-gray-400">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.overview || 'Aucune description disponible.'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {movie.budget > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-400">Budget</h3>
                    <p>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(movie.budget)}</p>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-400">Revenus</h3>
                    <p>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(movie.revenue)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Bande-annonce principale - seulement si disponible */}
          {trailer && (
            <div className="p-6 border-t border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Bande-annonce</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe 
                  className="w-full h-96"
                  src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
                  title={trailer.name}
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Onglets Médias - seulement si au moins un type de média disponible */}
          {(media.videos.length > 0 || media.images.length > 0) && (
            <div className="p-6 border-t border-gray-700">
              {/* Barre d'onglets - seulement si les deux types existent */}
              {(media.videos.length > 0 && media.images.length > 0) ? (
                <div className="flex mb-8 border-b border-gray-700">
                  {media.videos.length > 0 && (
                    <button
                      onClick={() => setActiveTab('trailers')}
                      className={`flex items-center px-6 py-3 relative transition-all duration-300 ${
                        activeTab === 'trailers' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <FiYoutube className="mr-2 text-lg" />
                      <span>Vidéos</span>
                      {activeTab === 'trailers' && (
                        <motion.div
                          layoutId="mediaTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"
                        />
                      )}
                    </button>
                  )}

                  {media.images.length > 0 && (
                    <button
                      onClick={() => setActiveTab('photos')}
                      className={`flex items-center px-6 py-3 relative transition-all duration-300 ${
                        activeTab === 'photos' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      <FiImage className="mr-2 text-lg" />
                      <span>Photos</span>
                      {activeTab === 'photos' && (
                        <motion.div
                          layoutId="mediaTabIndicator"
                          className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"
                        />
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <h2 className="text-2xl font-bold mb-6">
                  {media.videos.length > 0 ? 'Vidéos' : 'Galerie Photos'}
                </h2>
              )}

              {/* Contenu des médias */}
              {media.videos.length > 0 && (activeTab === 'trailers' || media.images.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media.videos.map((video: Video) => (
                    <div 
                      key={video.id} 
                      onClick={() => setSelectedMedia({
                        type: 'video',
                        url: video.key,
                        title: video.name
                      })}
                      className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="relative aspect-video">
                        {video.site === 'YouTube' && (
                          <Image
                            src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                            alt={video.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-colors">
                          <FiPlay className="h-12 w-12 text-white/80 hover:text-white" />
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium truncate">{video.name}</h3>
                        <p className="text-sm text-gray-400 truncate">{video.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {media.images.length > 0 && (activeTab === 'photos' || media.videos.length === 0) && (
                <div className="space-y-6">
                  <div className="max-w-4xl mx-auto">
                    <Slider
                      dots={true}
                      infinite={true}
                      speed={500}
                      slidesToShow={1}
                      slidesToScroll={1}
                      nextArrow={<NextArrow />}
                      prevArrow={<PrevArrow />}
                      accessibility={true}
                    >
                      {media.images.map((img: Image, index: number) => (
                        <div key={index} className="relative aspect-video">
                          <Image
                            src={`https://image.tmdb.org/t/p/original${img.file_path}`}
                            alt={`Movie still ${index + 1}`}
                            fill
                            className="object-contain"
                            quality={90}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {media.images.slice(0, 12).map((img: Image, index: number) => (
                      <button
                        key={`thumb-${img.file_path}`}
                        onClick={() => setSelectedMedia({
                          type: 'image',
                          url: img.file_path
                        })}
                        className="group aspect-video relative overflow-hidden rounded-lg"
                      >
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                          alt={`Vignette ${index + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Casting */}
          {credits?.cast?.length > 0 && (
            <div className="p-6 border-t border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Casting</h2>
              <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                {credits.cast.slice(0, 10).map((actor: any) => (
                  <div 
                    key={actor.id} 
                    className="flex-shrink-0 w-36"
                  >
                    <div className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 w-full">
                        {actor.profile_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-600">
                            <FiImage className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm truncate">{actor.name}</p>
                        <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Films similaires */}
          {similarMovies.length > 0 && (
            <div className="p-6 border-t border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Recommandations</h2>
              <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                {similarMovies.slice(0, 10).map((movie: any) => (
                  <Link 
                    key={movie.id} 
                    href={`/movie/${movie.id}`}
                    className="flex-shrink-0 w-40 hover:scale-105 transition-transform"
                  >
                    <div className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-[2/3]">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-600">
                            <FiImage className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm truncate">{movie.title}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-xs text-gray-400">
                            {movie.vote_average?.toFixed(1) || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal Media */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-3xl z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedia(null);
            }}
          >
            &times;
          </button>
          
          <div className="w-full max-w-6xl max-h-[90vh]">
            {selectedMedia.type === 'video' ? (
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedMedia.url}?autoplay=1`}
                  allowFullScreen
                />
              </div>
            ) : (
              <Image
                src={`https://image.tmdb.org/t/p/original${selectedMedia.url}`}
                alt={selectedMedia.title || 'Movie media'}
                width={1920}
                height={1080}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-all"
      aria-label="Next image"
    >
      <FiChevronRight size={24} />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-all"
      aria-label="Previous image"
    >
      <FiChevronLeft size={24} />
    </button>
  );
}