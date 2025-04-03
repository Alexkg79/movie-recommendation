import Providers from "./providers";
import "./globals.css";
import Header from "../components/Header";

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
            <Header />
            
            <main className="min-h-screen pt-16">
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