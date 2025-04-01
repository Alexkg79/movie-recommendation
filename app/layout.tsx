import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "CineReco - Recommandations de films",
  description: "Découvrez les meilleurs films et leurs critiques",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <div className="bg-gray-900 min-h-screen">
            <header className="bg-gray-800 p-4 shadow-md">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <a href="/" className="text-white text-2xl font-bold flex items-center">
                  <span className="mr-2">🎬</span> CineReco
                </a>
              </div>
            </header>
            
            <main className="min-h-screen">
              {children}
            </main>
            
            <footer className="bg-gray-800 text-gray-400 text-center p-4">
              <p>© {new Date().getFullYear()} CineReco - Propulsé par TMDB</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}