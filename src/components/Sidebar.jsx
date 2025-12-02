import { useState } from "react";
import { Gamepad2, Star, User, Trophy, Settings, X } from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  selectedTab,
  setSelectedTab,
  games,
  setActiveGame,
  darkMode
}) {
  const tabs = ["Games", "Achievements", "Profile", "Leaderboard", "Settings"];

  // NEW: Controls the dropdown for Games
  const [gamesOpen, setGamesOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-full transition-all duration-300 z-50 overflow-hidden ${
        sidebarOpen ? "w-80" : "w-0"
      } ${
        darkMode
          ? "bg-gray-900 border-r border-gray-600"
          : "bg-gradient-to-b from-green-800 to-gray-300 border-yellow-400"
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-yellow-400"
            }`}
          >
            Menu
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`hover:text-yellow-400 ${
              darkMode ? "text-white" : "text-white"
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {tabs.map((tab) => {
            const isGamesTab = tab === "Games";

            return (
              <div key={tab}>
                {/* MAIN TAB BUTTON */}
                <button
                  onClick={() => {
                    if (isGamesTab) {
                      setGamesOpen((prev) => !prev); // toggle dropdown
                    } else {
                      setSelectedTab(tab);
                      if (tab === "Achievements") {
                        setActiveGame(games[0]?.title);
                      }
                      setGamesOpen(false); // close dropdown when leaving Games
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    selectedTab === tab
                      ? darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-yellow-500 text-white"
                      : darkMode
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-green-700 bg-opacity-50 hover:bg-yellow-500 text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isGamesTab && <Gamepad2 className="w-5 h-5" />}
                    {tab === "Achievements" && <Star className="w-5 h-5" />}
                    {tab === "Profile" && <User className="w-5 h-5" />}
                    {tab === "Leaderboard" && <Trophy className="w-5 h-5" />}
                    {tab === "Settings" && <Settings className="w-5 h-5" />}
                    <span>{tab}</span>
                  </div>

                  {/* ▼ / ▲ dropdown arrow */}
                  {isGamesTab && (
                    <span className="text-sm">{gamesOpen ? "▲" : "▼"}</span>
                  )}
                </button>

                {/* SUBMENU: Dropdown contents for Games */}
                {isGamesTab && gamesOpen && (
                  <div className="ml-8 mt-2 space-y-2">

                    {/* ✅ NEW: Biology Games button */}
                    <button
                      onClick={() => {
                        setActiveGame("Biology");
                        setSelectedTab("Games");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                        darkMode
                          ? "bg-gray-800 text-white hover:bg-gray-700"
                          : "bg-green-600 text-white hover:bg-yellow-500"
                      }`}
                    >
                      Biology Games
                    </button>

                    {/* Existing dynamic game list */}
                    {games.map((game) => (
                      <button
                        key={game.title}
                        onClick={() => {
                          setActiveGame(game.title);
                          setSelectedTab("Games");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                          darkMode
                            ? "bg-gray-800 text-white hover:bg-gray-700"
                            : "bg-green-600 text-white hover:bg-yellow-500"
                        }`}
                      >
                        {game.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
