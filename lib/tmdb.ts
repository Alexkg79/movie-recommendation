export const fetchTrendingMovies = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`);
    if (!res.ok) throw new Error("Erreur lors du chargement des films");
    return res.json();
  };
  