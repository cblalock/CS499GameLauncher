import { Gamepad2, Star, User, Trophy, Settings, X } from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  selectedTab,
  setSelectedTab,
  games,
  setActiveGame,
  darkMode,
  sidebarPosition,
}) {
  const tabs = ["Games", "Achievements", "Profile", "Leaderboard", "Settings"];

  return (
    <div
      className={`fixed top-0 h-full transition-all duration-300 z-50 overflow-hidden ${
        sidebarOpen ? "w-80" : "w-0"
      } ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-b from-green-800 to-gray-300"
      } ${
        sidebarPosition === "left"
          ? "left-0 border-r"
          : "right-0 border-l"
      } ${darkMode ? "border-gray-600" : "border-yellow-400"}`}
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
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                if (tab === "Achievements") setActiveGame(games[0]?.title);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                selectedTab === tab
                  ? darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-yellow-500 text-white"
                  : darkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-green-700 bg-opacity-50 hover:bg-yellow-500 text-white"
              }`}
            >
              {tab === "Games" && <Gamepad2 className="w-5 h-5" />}
              {tab === "Achievements" && <Star className="w-5 h-5" />}
              {tab === "Profile" && <User className="w-5 h-5" />}
              {tab === "Leaderboard" && <Trophy className="w-5 h-5" />}
              {tab === "Settings" && <Settings className="w-5 h-5" />}
              <span>{tab}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

