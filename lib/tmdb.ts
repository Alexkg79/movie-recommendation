// lib/tmdb.ts
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
import { MovieFilters } from '../components/FilterBar';

// Types
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

type MovieDetails = Movie & {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  tagline: string;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  production_countries: { iso_3166_1: string; name: string }[];
  status: string;
};

type Genre = {
  id: number;
  name: string;
};

type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

type Crew = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

type Credits = {
  cast: Cast[];
  crew: Crew[];
};

// Fetchers
export async function fetchTrendingMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des films tendances');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur fetchTrendingMovies:', error);
    return [];
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1&include_adult=false`
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors de la recherche de films');
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur searchMovies:', error);
    return [];
  }
}

// Récupérer la liste des genres
export async function fetchGenres() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des genres');
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Erreur API genres:', error);
    return [];
  }
}

// Fonction pour récupérer les films avec filtres
export async function fetchMoviesWithFilters(
  query: string = '',
  page: number = 1,
  filters: MovieFilters = {}
) {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  
  // Déterminer l'endpoint en fonction de la présence d'une requête de recherche
  let endpoint = query 
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
    : `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&page=${page}`;
  
  // Ajouter les paramètres de filtrage s'ils sont fournis
  if (filters.year) {
    endpoint += `&primary_release_year=${filters.year}`;
  }
  
  if (filters.genre) {
    endpoint += `&with_genres=${filters.genre}`;
  }
  
  if (filters.minRating) {
    endpoint += `&vote_average.gte=${filters.minRating}`;
  }
  
  if (filters.sortBy && !query) { // Le tri ne fonctionne qu'avec "discover", pas avec "search"
    endpoint += `&sort_by=${filters.sortBy}`;
  }
  
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Erreur lors de la récupération des films');
    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

export async function fetchMovieDetails(movieId: string): Promise<MovieDetails | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des détails du film ${movieId}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur fetchMovieDetails:', error);
    return null;
  }
}

export async function fetchMovieCredits(movieId: string): Promise<Credits | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=fr-FR`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du casting du film ${movieId}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur fetchMovieCredits:', error);
    return null;
  }
}

export async function fetchSimilarMovies(movieId: string): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des films similaires à ${movieId}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur fetchSimilarMovies:', error);
    return [];
  }
}

export async function fetchMoviesByGenre(genreId: number): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&with_genres=${genreId}&sort_by=popularity.desc&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des films du genre ${genreId}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur fetchMoviesByGenre:', error);
    return [];
  }
}

export async function fetchMovieVideos(movieId: string): Promise<any[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=fr-FR`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des vidéos du film ${movieId}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erreur fetchMovieVideos:', error);
    return [];
  }
}