"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingMovies } from "@/lib/tmdb";
import Link from "next/link";

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: fetchTrendingMovies,
  });

  if (isLoading) return <p className="text-white p-8">Chargement...</p>;
  if (error) return <p className="text-red-500 p-8">Erreur : {(error as Error).message}</p>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-5">
      <h1 className="text-3xl font-bold mb-6 max-w-6xl mx-auto">🎬 Films Tendance</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {data.results.map((movie: any) => (
          <Link href={`/film/${movie.id}`} key={movie.id}>
            <div className="bg-gray-800 p-4 rounded-lg transition-transform hover:scale-105 h-full flex flex-col">
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                  className="w-full rounded-md"
                />
              ) : (
                <div className="w-full h-48 bg-gray-700 rounded-md flex items-center justify-center">
                  No Image
                </div>
              )}
              <h2 className="text-lg font-semibold mt-3">{movie.title}</h2>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-sm">{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}