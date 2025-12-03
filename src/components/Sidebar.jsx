import { useState } from "react";
import { Gamepad2, Star, User, Trophy, Settings, Users, X } from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  selectedTab,
  setSelectedTab,
  games,
  setActiveGame,
  darkMode,
  sidebarPosition, // Added sidebarPosition prop
  theme // Added theme prop
}) {
  // Updated tabs order: Friends comes after Profile
  const tabs = ["Games", "Achievements", "Profile", "Friends", "Leaderboard", "Settings"];

  const [gamesOpen, setGamesOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 ${
        sidebarPosition === "right" ? "right-0" : "left-0"
      } h-full transition-all duration-300 z-50 overflow-hidden ${
        sidebarOpen ? "w-80" : "w-0"
      } ${
        theme.background
      } ${
        theme.text
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h2
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-yellow-400"}`}
          >
            Menu
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`hover:text-yellow-400 ${darkMode ? "text-white" : "text-white"}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {tabs.map((tab) => {
            const isGamesTab = tab === "Games";
            const isFriendsTab = tab === "Friends";

            return (
              <div key={tab}>
                <button
                  onClick={() => {
                    if (isGamesTab) {
                      setGamesOpen((prev) => !prev);
                    } else {
                      setSelectedTab(tab);
                      if (tab === "Achievements") {
                        setActiveGame(games[0]?.title);
                      }
                      setGamesOpen(false);
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
                    {isFriendsTab && <Users className="w-5 h-5" />}
                    {tab === "Leaderboard" && <Trophy className="w-5 h-5" />}
                    {tab === "Settings" && <Settings className="w-5 h-5" />}
                    <span>{tab}</span>
                  </div>

                  {isGamesTab && <span className="text-sm">{gamesOpen ? "▲" : "▼"}</span>}
                </button>

                {isGamesTab && gamesOpen && (
                  <div className="ml-8 mt-2 space-y-2">
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
