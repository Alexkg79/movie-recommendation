import { useState } from 'react'; // Ajout de l'import manquant
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import useFavorites from '../hooks/useFavorites';

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
};

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const movieId = Number(movie.id);


  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.jpg';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie.id);
  };

  return (
    <Link href={`/movie/${movie.id}`} passHref legacyBehavior>
      <motion.a
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="rounded-lg shadow-lg overflow-hidden bg-white h-full flex flex-col relative group"
      >
        {/* Bouton Favoris */}
        <motion.button
          onClick={handleFavoriteClick}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 rounded-full backdrop-blur-sm shadow-md hover:bg-red-100 transition-colors"
          aria-label={isFavorite(movie.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <FiHeart 
            className={`h-5 w-5 ${isFavorite(movie.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </motion.button>

        {/* Image du film */}
        <div className="relative h-64 w-full">
          <Image
            src={imageError ? '/placeholder.jpg' : posterPath}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white text-sm line-clamp-3">
              {movie.overview || 'Aucune description disponible'}
            </p>
          </div>
        </div>

        {/* Détails du film */}
        <div className="p-4 flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A'}
            </span>
            <span className="text-xs text-gray-500">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Date inconnue'}
            </span>
          </div>
        </div>
      </motion.a>
    </Link>
  );
}