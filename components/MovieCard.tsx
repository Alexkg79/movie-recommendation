import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  [key: string]: any;
};

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/placeholder.jpg';
  
  return (
    <Link href={`/movie/${movie.id}`} passHref>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="rounded-lg shadow-lg overflow-hidden bg-white h-full flex flex-col transform transition-all duration-300 hover:shadow-xl"
      >
        <div className="relative h-64 group">
          <Image
            src={imageError ? '/placeholder.jpg' : posterPath}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <p className="text-white text-sm line-clamp-3">{movie.overview || 'Aucune description disponible'}</p>
          </div>
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors">
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
      </motion.div>
    </Link>
  );
}