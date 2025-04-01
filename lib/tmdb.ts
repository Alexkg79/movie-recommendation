const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTrendingMovies() {
  const response = await fetch(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR`
  );
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des films tendance');
  }
  
  return response.json();
}

export async function fetchMovieDetails(id: string) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR`
  );
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des détails du film');
  }
  
  return response.json();
}

export async function fetchMovieVideos(id: string) {
  const response = await fetch(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=fr-FR`
  );
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des vidéos');
  }
  
  const data = await response.json();
  
  // Si pas de résultats en français, essayer en anglais
  if (data.results.length === 0) {
    const enResponse = await fetch(
      `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
    );
    
    if (!enResponse.ok) {
      throw new Error('Erreur lors de la récupération des vidéos');
    }
    
    return enResponse.json();
  }
  
  return data;
}