import { useState } from 'react';
import { Play, Gamepad2, Star, Clock, Download } from 'lucide-react';

export default function GameLauncher() {
  const [games, setGames] = useState([
    {
      id: 1,
      title: "Space Adventure",
      description: "Explore the cosmos in this exciting space shooter",
      thumbnail: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=300&fit=crop",
      downloadUrl: "/games/space-adventure.zip", // Path to  game files
      playInBrowser: false,
      lastPlayed: "2 days ago",
      rating: 4.5
    },
    {
      id: 2,
      title: "Puzzle Quest",
      description: "Challenge your mind with intricate puzzles",
      thumbnail: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop",
      downloadUrl: "/games/puzzle-quest.zip",
      playInBrowser: false,
      lastPlayed: "1 week ago",
      rating: 4.8
    },
    {
      id: 3,
      title: "Racing Fury",
      description: "High-speed racing action on various tracks",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
      downloadUrl: "/games/racing-fury.zip",
      playInBrowser: false,
      lastPlayed: "3 days ago",
      rating: 4.2
    }
  ]);

  const [selectedGame, setSelectedGame] = useState(null);

  const handleLaunch = (game) => {
    // Download the game
    const link = document.createElement('a');
    link.href = game.downloadUrl;
    link.download = `${game.title}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-gold-900 to-gold-900 m-0 p-0">
      {/* Header */}
      <header className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-white border-opacity-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <img src="/uab-logo.png" alt="UAB Logo" className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-white">UAB Game Launcher</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg overflow-hidden border border-white border-opacity-20 hover:border-purple-400 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => setSelectedGame(game)}
              >
                <div className="relative">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-semibold">{game.rating}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{game.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <Clock className="w-4 h-4" />
                      <span>{game.lastPlayed}</span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunch(game);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add Game Button */}
        <div className="flex justify-center">
          <button
            onClick={() => alert('Add game functionality - you can implement a form to add new games')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
          >
            + Add New Game
          </button>
        </div>
      </main>

      {/* Game Detail Modal */}
      {selectedGame && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg max-w-2xl w-full p-6 border border-purple-500"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedGame.thumbnail}
              alt={selectedGame.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-3xl font-bold text-white mb-2">{selectedGame.title}</h2>
            <p className="text-gray-300 mb-6">{selectedGame.description}</p>
            
            <div className="flex gap-4">
              <button
                onClick={() => handleLaunch(selectedGame)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
              >
                <Play className="w-5 h-5" />
                Launch Game
              </button>
              <button
                onClick={() => setSelectedGame(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}