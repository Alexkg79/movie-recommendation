"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchMovieDetails, fetchMovieVideos } from "@/lib/tmdb";

interface Film {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genres: { id: number; name: string }[];
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export default function FilmDetail() {
  const params = useParams();
  const id = params.id as string;
  const [film, setFilm] = useState<Film | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Charger en parallèle les détails du film et les vidéos
        const [filmData, videosData] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieVideos(id)
        ]);
        
        setFilm(filmData);
        setVideos(videosData.results);
      } catch (err: any) {
        console.error("Erreur:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [id]);

  // Trouver une bande-annonce YouTube
  const trailer = videos.find(
    video => video.site === "YouTube" && 
    (video.type === "Trailer" || video.type === "Teaser")
  );

  if (isLoading) return <div className="text-white text-center p-10">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center p-10">Erreur: {error}</div>;
  if (!film) return <div className="text-white text-center p-10">Film non trouvé</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => window.history.back()} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
      >
        &larr; Retour
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {film.poster_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w500${film.poster_path}`} 
              alt={film.title} 
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              Pas d'image disponible
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{film.title}</h1>
          <div className="flex items-center mb-4">
            {/* Résolution du conflit CSS - suppression de inline-block */}
            <span className="bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
              {film.vote_average.toFixed(1)}
            </span>
            <span className="ml-2 text-gray-400">/ 10</span>
            {film.release_date && (
              <span className="ml-4 text-gray-400">
                {new Date(film.release_date).getFullYear()}
              </span>
            )}
          </div>
          
          {film.genres && film.genres.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {film.genres.map(genre => (
                <span key={genre.id} className="bg-gray-800 text-sm px-3 py-1 rounded">
                  {genre.name}
                </span>
              ))}
            </div>
          )}
          
          <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
          <p className="text-gray-300 mb-6">
            {film.overview || "Aucun synopsis disponible"}
          </p>
          
          {trailer && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Bande-annonce</h2>
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Bande-annonce"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          
          {!trailer && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Bande-annonce</h2>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Aucune bande-annonce disponible</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}