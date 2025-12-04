import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Friends from "./components/friendspage";
import Header from "./components/Header";
import Games from "./components/Games";
import Achievements from "./components/Achievements";
import GameModal from "./components/GameModal";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import LeaderboardPage from "./components/LeaderboardPage";
import themes from "./components/Themes";

const API_BASE_URL = "http://localhost:3000/api";

export default function App() {
  // -----------------------------
  // ✅ LOCALSTORAGE SETTINGS
  // -----------------------------
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        // Validate essential keys
        if (!parsed.background || !parsed.text) return themes[Object.keys(themes)[0]];
        return parsed;
      } catch {
        return themes[Object.keys(themes)[0]];
      }
    }
    return themes[Object.keys(themes)[0]];
  });

  const [sidebarPosition, setSidebarPosition] = useState(
    () => localStorage.getItem("sidebarPosition") || "left"
  );

  const [thumbnailSize, setThumbnailSize] = useState(
    () => localStorage.getItem("thumbnailSize") || "medium"
  );

  const [defaultTab, setDefaultTab] = useState(
    () => localStorage.getItem("defaultTab") || "Games"
  );

  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("notifications") === "true"
  );

  const [soundEffects, setSoundEffects] = useState(
    () => localStorage.getItem("soundEffects") === "true"
  );

  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem("fontSize") || "default"
  );

  const [selectedDepartment, setSelectedDepartment] = useState("biology");

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
    localStorage.setItem("sidebarPosition", sidebarPosition);
    localStorage.setItem("thumbnailSize", thumbnailSize);
    localStorage.setItem("defaultTab", defaultTab);
    localStorage.setItem("notifications", notifications);
    localStorage.setItem("soundEffects", soundEffects);
    localStorage.setItem("fontSize", fontSize);
  }, [
    theme,
    sidebarPosition,
    thumbnailSize,
    defaultTab,
    notifications,
    soundEffects,
    fontSize,
  ]);

  // -----------------------------
  // USER + LEADERBOARD STATES
  // -----------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedLeaderboardGame, setSelectedLeaderboardGame] = useState(1);

  // -----------------------------
  // FETCH GAMES FROM BACKEND
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
  // LOAD ACHIEVEMENTS PER GAME
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
  // LAUNCH GAME FILE
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
  // FONT SIZE CLASS
  // -----------------------------
  const fontClass =
    fontSize === "small"
      ? "text-sm"
      : fontSize === "large"
      ? "text-lg"
      : fontSize === "xl"
      ? "text-xl"
      : "text-base";

  // -----------------------------
  // RENDER UI
  // -----------------------------
  return (
    <div
      className={`min-h-screen w-full flex transition-colors duration-300 ${theme.background} ${fontClass}`}
      style={{ flexDirection: sidebarPosition === 'right' ? 'row-reverse' : 'row' }}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        games={games}
        setActiveGame={setActiveGame}
        theme={theme}
        sidebarPosition={sidebarPosition}
        setSelectedDepartment={setSelectedDepartment} // Pass sidebarPosition to Sidebar
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{
          marginLeft: sidebarOpen && sidebarPosition === "left" ? "320px" : 0,
          marginRight: sidebarOpen && sidebarPosition === "right" ? "320px" : 0,
        }}
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          theme={theme}
          sidebarPosition={sidebarPosition}
        />

        <main className="flex-1 p-6">
          {selectedTab === "Games" && (
            <Games
              games={games}
              gamesLoading={gamesLoading}
              setSelectedGame={setSelectedGame}
              handleLaunch={handleLaunch}
              theme={theme}
              thumbnailSize={thumbnailSize}
              selectedDepartment={selectedDepartment}
            />
          )}

          {selectedTab === "Achievements" && (
            <Achievements
              achievements={achievements}
              activeGame={activeGame}
              setActiveGame={setActiveGame}
              games={games}
              theme={theme}
            />
          )}

          {selectedTab === "Profile" && (
            <Profile
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              games={games}
              theme={theme}
            />
          )}

          {selectedTab === "Settings" && (
            <Settings
              theme={theme}
              setTheme={setTheme}
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
              fontSize={fontSize}
              setFontSize={setFontSize}
            />
          )}

          {selectedTab === "Leaderboard" && (
            <LeaderboardPage
              currentUser={currentUser}
              theme={theme}
            />
          )}

          {selectedTab === "Friends" && (
            <Friends
              currentUser={currentUser}
              theme={theme}
            />
          )}
        </main>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <GameModal
          selectedGame={selectedGame}
          handleLaunch={handleLaunch}
          onClose={() => setSelectedGame(null)}
          theme={theme}
        />
      )}
    </div>
  );
}
