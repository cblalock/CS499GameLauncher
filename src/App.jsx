import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Games from "./components/Games";
import Achievements from "./components/Achievements";
import GameModal from "./components/GameModal";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import LeaderboardPage from "./components/LeaderboardPage";

const API_BASE_URL = "http://localhost:3000/api";

export default function App() {

  // -----------------------------
  // ✅ LOCALSTORAGE SETTINGS (your code)
  // -----------------------------
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [sidebarPosition, setSidebarPosition] = useState(() => localStorage.getItem("sidebarPosition") || "left");
  const [thumbnailSize, setThumbnailSize] = useState(() => localStorage.getItem("thumbnailSize") || "medium");
  const [defaultTab, setDefaultTab] = useState(() => localStorage.getItem("defaultTab") || "Games");
  const [notifications, setNotifications] = useState(() => localStorage.getItem("notifications") === "true");
  const [soundEffects, setSoundEffects] = useState(() => localStorage.getItem("soundEffects") === "true");
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("sidebarPosition", sidebarPosition);
    localStorage.setItem("thumbnailSize", thumbnailSize);
    localStorage.setItem("defaultTab", defaultTab);
    localStorage.setItem("notifications", notifications);
    localStorage.setItem("soundEffects", soundEffects);
    localStorage.setItem("language", language);
  }, [darkMode, sidebarPosition, thumbnailSize, defaultTab, notifications, soundEffects, language]);

  // -----------------------------
  // ✅ USER + LEADERBOARD STATES (groupmate)
  // -----------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedLeaderboardGame, setSelectedLeaderboardGame] = useState(1);

  // -----------------------------
  // ✅ GAMES FETCHED FROM BACKEND (groupmate)
  // -----------------------------
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/games`)
      .then((res) => res.json())
      .then((gamesData) => setGames(gamesData))
      .catch((err) => console.error("Error fetching games:", err))
      .finally(() => setGamesLoading(false));
  }, []);

  // -----------------------------
  // Shared UI States
  // -----------------------------
  const [selectedGame, setSelectedGame] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(defaultTab);
  const [achievements, setAchievements] = useState([]);
  const [activeGame, setActiveGame] = useState(null);

  // -----------------------------
  // ✅ LOAD ACHIEVEMENTS (your code)
  // -----------------------------
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

  // -----------------------------
  // Launch game download
  // -----------------------------
  const handleLaunch = (game) => {
    const link = document.createElement("a");
    link.href = game.downloadUrl;
    link.download = `${game.title}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div
      className={`min-h-screen w-full flex ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
          : "bg-gradient-to-br from-green-800 via-gray-300 to-yellow-400"
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

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-80" : "ml-0"
        }`}
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          sidebarPosition={sidebarPosition}
        />

        <main className="flex-1 p-6">

          {selectedTab === "Games" && (
            <Games
              games={games}
              gamesLoading={gamesLoading}
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
              darkMode={darkMode}
            />
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

