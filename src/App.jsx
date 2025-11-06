import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Games from "./components/Games";
import Achievements from "./components/Achievements";
import GameModal from "./components/GameModal";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import LeaderboardPage from "./components/LeaderboardPage";


export default function App() {

  const [currentUser, setCurrentUser] = useState(null); // logged in user state
  const [selectedLeaderboardGame, setSelectedLeaderboardGame] = useState(1); // which games leaderboard
  
  const [games, setGames] = useState([
    {
      id: 1,
      title: "Glycolysim",
      description: "tetris or something with molecules",
      thumbnail:
        "https://images.unsplash.com/photo-1576086639808-ddfd21aa668c?q=80&w=880&auto=format&fit=crop",
      downloadUrl: "/games/Glycolysim.zip",
      playInBrowser: false,
      lastPlayed: "2 days ago",
      score: 400,
    },
    {
      id: 2,
      title: "ImmunoHeroes",
      description: "idk what this game is about either",
      thumbnail:
        "https://plus.unsplash.com/premium_photo-1725667172926-0a33e2fc1596?q=80&w=1605&auto=format&fit=crop",
      downloadUrl: "/games/ImmunoHeroes.zip",
      playInBrowser: false,
      lastPlayed: "1 week ago",
      score: 500,
    },
  ]);

  const [selectedGame, setSelectedGame] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Games");
  const [achievements, setAchievements] = useState([]);
  const [activeGame, setActiveGame] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // settings states
  const [sidebarPosition, setSidebarPosition] = useState("left");
  const [thumbnailSize, setThumbnailSize] = useState("medium");
  const [defaultTab, setDefaultTab] = useState("Games");
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (selectedTab === "Achievements" && activeGame) {
      fetch(`/games/${activeGame}/achievements.json`)
        .then((res) => {
          if (!res.ok) throw new Error("No achievements file found");
          return res.json();
        })
        .then((data) => setAchievements(data))
        .catch(() => setAchievements([]));
    }
  }, [selectedTab, activeGame]);

  const handleLaunch = (game) => {
    const link = document.createElement("a");
    link.href = game.downloadUrl;
    link.download = `${game.title}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
  <div
    className={`min-h-screen w-full flex ${
      darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
        : "bg-gradient-to-br from-green-800 via-zinc-300 to-yellow-400"
    }`}
  >
    <Sidebar
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
      games={games}
      setActiveGame={setActiveGame}
      darkMode={darkMode}
      sidebarPosition={sidebarPosition}
    />

    <div className={`flex-1 flex flex-col transition-all duration-300 ${
      sidebarOpen ? "ml-80" : "ml-0"
    }`}>
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
      />

      <main className="flex-1 p-6">
        {selectedTab === "Games" && (
          <Games
            games={games}
            setSelectedGame={setSelectedGame}
            handleLaunch={handleLaunch}
            darkMode={darkMode}
            thumbnailSize={thumbnailSize}
          />
        )}

        {selectedTab === "Achievements" && (
          <Achievements
            achievements={achievements}
            activeGame={activeGame}
            setActiveGame={setActiveGame}
            games={games}
            darkMode={darkMode}
          />
        )}

        {selectedTab === "Profile" && (
          <Profile 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser}
          games={games} 
          darkMode={darkMode} />
        )}

        {selectedTab === "Settings" && (
          <Settings
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            sidebarPosition={sidebarPosition}
            setSidebarPosition={setSidebarPosition}
            thumbnailSize={thumbnailSize}
            setThumbnailSize={setThumbnailSize}
            defaultTab={defaultTab}
            setDefaultTab={setDefaultTab}
            notifications={notifications}
            setNotifications={setNotifications}
            soundEffects={soundEffects}
            setSoundEffects={setSoundEffects}
            language={language}
            setLanguage={setLanguage}
          />
        )}

        {selectedTab === "Leaderboard" && (
          <LeaderboardPage
          currentUser={currentUser}
          darkMode={darkMode}
          />
        )}
      </main>
    </div>

    {selectedGame && (
      <GameModal
        selectedGame={selectedGame}
        handleLaunch={handleLaunch}
        onClose={() => setSelectedGame(null)}
        darkMode={darkMode}
      />
    )}
  </div>
);
}

