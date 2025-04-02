import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
    <Link href={`/movie/${movie.id}`} className="movie-card">
      <div className="rounded-lg shadow-lg overflow-hidden bg-white h-full flex flex-col">
        <div className="relative h-64">
          <Image
            src={imageError ? '/placeholder.jpg' : posterPath}
            alt={movie.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="p-4 flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-700">{movie.title}</h3>
          <p className="text-sm text-gray-700 line-clamp-3">{movie.overview || 'Aucune description disponible'}</p>
          <div className="mt-2 flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
              {movie.vote_average ? `${movie.vote_average.toFixed(1)}/10` : 'N/A'}
            </span>
            <span className="ml-2 text-xs text-gray-500">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Date inconnue'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}