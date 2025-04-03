import { useState, useEffect } from 'react';

const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Chargement initial synchrone
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const saved = localStorage.getItem('favorites');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setFavorites(parsed.filter(id => typeof id === 'number'));
          }
        }
      } catch (err) {
        console.error("Erreur de parsing des favoris", err);
        localStorage.removeItem('favorites');
      }
    };

    loadFavorites();
    
    // Écouteur pour les changements entre onglets
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Synchronisation avec localStorage
  const syncFavorites = (newFavorites: number[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const toggleFavorite = (movieId: number) => {
    syncFavorites(
      favorites.includes(movieId)
        ? favorites.filter(id => id !== movieId)
        : [...favorites, movieId]
    );
  };

  return { 
    favorites, 
    toggleFavorite, 
    isFavorite: (movieId: number) => favorites.includes(movieId) 
  };
};

export default useFavorites;