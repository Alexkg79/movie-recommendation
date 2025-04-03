'use client';

import Link from 'next/link';
import { FiHeart, FiHome, FiFilm } from 'react-icons/fi';
import useFavorites from '../hooks/useFavorites';

export default function Header() {
  const { favorites } = useFavorites();

  return (
    <header className="bg-gray-800 shadow-md py-4 fixed w-full top-0 z-40">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center text-2xl font-bold text-blue-400 hover:text-blue-300">
          <FiFilm className="mr-2" />
          CineReco
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link href="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
            <FiHome className="mr-1" /> Accueil
          </Link>
          <Link 
            href="/favorites" 
            className="flex items-center text-gray-300 hover:text-red-400 transition-colors relative"
          >
            <FiHeart className="mr-1" />
            Favoris
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}