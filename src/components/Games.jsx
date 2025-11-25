import { Clock, Download, Trophy } from "lucide-react";

export default function Games({ games, setSelectedGame, handleLaunch, darkMode, thumbnailSize }) {
  // Map thumbnailSize setting to height classes
  const thumbnailHeightClass = {
    small: "h-32",
    medium: "h-48", // default
    large: "h-64",
  };

  return (
    <section>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-white"}`}>Biology Games</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`rounded-lg overflow-hidden border transition-all hover:scale-105 cursor-pointer ${
              darkMode
                ? "bg-gray-800 border-gray-700 hover:border-gray-500"
                : "bg-white bg-opacity-10 border-white border-opacity-20 hover:border-yellow-400"
            }`}
            onClick={() => setSelectedGame(game)}
          >
            <div className="relative">
              <img
                src={game.thumbnail}
                alt={game.title}
                className={`w-full object-cover ${thumbnailHeightClass[thumbnailSize] || "h-48"}`}
              />
              <div className={`absolute top-2 right-2 rounded-full px-3 py-1 flex items-center gap-1 ${
                darkMode ? "bg-gray-600" : "bg-black bg-opacity-70"
              }`}>
                <Trophy className={`w-4 h-4 ${darkMode ? "text-white" : "text-yellow-400"}`} />
                <span className={`text-sm font-semibold ${darkMode ? "text-white" : "text-white"}`}>
                  {game.score}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-white"}`}>{game.title}</h3>
              <p className={`text-sm mb-4 ${darkMode ? "text-gray-300" : "text-white"}`}>{game.description}</p>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
                  <Clock className="w-4 h-4" />
                  <span>{game.lastPlayed}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleLaunch(game); }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-green-900 hover:bg-green-700 text-white"
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}