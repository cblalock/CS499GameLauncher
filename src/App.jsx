import { useState } from 'react';
import { Play, Gamepad2, Star, Clock, Download, Menu, X, Trophy, Settings, User } from 'lucide-react';

export default function GameLauncher() {
  const [games, setGames] = useState([
    /* Games */
    {
      id: 1,
      title: "Glycolysim",
      description: "tetris or something with molecules",
      thumbnail: "https://images.unsplash.com/photo-1576086639808-ddfd21aa668c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      downloadUrl: "/games/Glycolysim.zip",
      playInBrowser: false,
      lastPlayed: "2 days ago",
      score: 500
    },
    {
      id: 2,
      title: "ImmunoHeroes",
      description: "idk what this game is about either",
      thumbnail: "https://plus.unsplash.com/premium_photo-1725667172926-0a33e2fc1596?q=80&w=1605&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      downloadUrl: "/games/ImmunoHeroes.zip",
      playInBrowser: false,
      lastPlayed: "1 week ago",
      score: 500
    }
  ]);

  const [selectedGame, setSelectedGame] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Launching */

  const handleLaunch = (game) => { 
    const link = document.createElement('a');
    link.href = game.downloadUrl;
    link.download = `${game.title}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-800 via-gray-300 to-yellow-400 m-0 p-0 flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-green-800 to-gray-300 bg-opacity-95 backdrop-blur-xl border-r border-yellow-400 transition-all duration-300 z-50 ${
          sidebarOpen ? 'w-80' : 'w-0'
        } overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-yellow-400">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-yellow-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-700 bg-opacity-50 hover:bg-yellow-500 hover:bg-opacity-30 rounded-lg text-white transition-all">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-700 bg-opacity-50 hover:bg-yellow-500 hover:bg-opacity-30 rounded-lg text-white transition-all">
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-green-700 bg-opacity-50 hover:bg-yellow-500 hover:bg-opacity-30 rounded-lg text-white transition-all">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>

          {/* Placeholder for future leaderboard */}
          <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg border border-yellow-400 border-opacity-50">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Top Players</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((rank) => (
                <div key={rank} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Player {rank}</span>
                  <span className="text-yellow-400 font-semibold">{1000 - rank * 100} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-white border-opacity-10">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:text-yellow-400 transition-colors mr-2"
              >
                <Menu className="w-6 h-6" />
              </button>
              <img src="/uab-logo.png" alt="UAB Logo" className="w-12 h-12" />
              <h1 className="text-3xl font-bold text-white">UAB Game Launcher</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Featured Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Biology Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg overflow-hidden border border-white border-opacity-20 hover:border-yellow-400 transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="relative">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full px-3 py-1 flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-semibold">{game.score}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                    <p className="text-white text-sm mb-4">{game.description}</p>
                    
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
                        className="bg-green-900 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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

          {/* Add Game Button, this should be admin side only */}
          <div className="flex justify-center">
            <button
              onClick={() => alert('Add game functionality - you can implement a form to add new games')}
              className="bg-gradient-to-r from-green-900 to-yellow-400 hover:from-yellow-400 hover:to-green-900 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
            >
              + Add New Game
            </button>
          </div>
        </main>
      </div>

      {/* Game Detail Modal */}
      {selectedGame && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedGame(null)}
        >
          <div
            className="bg-gradient-to-br from-green-900 to-gray-800 rounded-lg max-w-2xl w-full p-6 border border-yellow-400"
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
                className="flex-1 bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Game
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