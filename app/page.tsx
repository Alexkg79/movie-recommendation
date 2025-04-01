"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingMovies } from "@/lib/tmdb";

export default function Home() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: fetchTrendingMovies,
  });

  if (isLoading) return <p className="text-white">Chargement...</p>;
  if (error) return <p className="text-red-500">Erreur : {error.message}</p>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-5">
      <h1 className="text-3xl font-bold mb-4">🎬 Films Tendance</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.results.map((movie: any) => (
          <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full rounded-md" />
            <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
