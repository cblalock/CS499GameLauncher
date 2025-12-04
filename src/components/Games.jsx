import { Clock, Download, Trophy } from "lucide-react";

export default function Games({ games, setSelectedGame, handleLaunch, theme, thumbnailSize, selectedDepartment }) {
  // Filter games by selected department
  const filteredGames = games.filter(game => game.department === selectedDepartment);

  const thumbnailHeightClass = {
    small: "h-32",
    medium: "h-48",
    large: "h-64",
  };

  const displayDepartment = selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1);

  return (
    <section>
      <h2 className={`text-2xl font-bold mb-6 ${theme?.text || "text-white"}`}>
        {displayDepartment} Games
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.length === 0 ? (
          <p className={theme?.text || "text-white"}>No games available in this department.</p>
        ) : (
          filteredGames.map((game) => (
            <div
              key={game.id}
              className={`rounded-lg overflow-hidden border transition-all hover:scale-105 cursor-pointer ${
                theme?.background?.includes('gray-800')
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
              </div>
              <div className="p-4">
                <h3 className={`text-xl font-bold mb-2 ${theme?.text || "text-white"}`}>{game.title}</h3>
                <p className={`text-sm mb-4 ${theme?.textAlt || "text-gray-300"}`}>{game.description}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLaunch(game); }}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all ${
                      theme?.background?.includes('gray-800') 
                        ? "bg-gray-700 hover:bg-gray-600 text-white" 
                        : "bg-green-900 hover:bg-green-700 text-white"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}