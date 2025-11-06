import { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";

export default function LeaderboardPage({ currentUser, darkMode }) {
  const [selectedGame, setSelectedGame] = useState(1); // Default to game 1
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userAvatars = {
    user1: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    user2: "https://images.unsplash.com/photo-1760681557681-457694845c7d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDN8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500",
    user3: "https://images.unsplash.com/photo-1760517340115-7019ac6f3666?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDU1fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500"
  };

  // Fetch leaderboard data when game changes
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/leaderboard/${selectedGame}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Leaderboard data from backend:', data);
        
        // Enrich backend data with avatars
        const enriched = data.map((player) => ({
          id: player.name,           // Username as ID
          name: player.name,          // Username as display name
          score: player.score,        // Score from backend
          avatar: userAvatars[player.name] || null // Match to hardcoded avatars
        }));
        
        setPlayers(enriched);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard:', error);
        setPlayers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedGame]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-white'}`}>
        Game Leaderboards
      </h1>

      {/* Game Selector */}
      <div className="mb-6">
        <label className={`block mb-2 font-semibold ${darkMode ? 'text-white' : 'text-white'}`}>
          Select Game:
        </label>
        <select
          value={selectedGame}
          onChange={(e) => setSelectedGame(Number(e.target.value))}
          className={`p-3 rounded-lg border ${
            darkMode 
              ? 'bg-gray-700 text-white border-gray-600' 
              : 'bg-white text-gray-900 border-gray-300'
          }`}
        >
          <option value={1}>Glycolysim</option>
          <option value={2}>ImmunoHeroes</option>
        </select>
      </div>

      {/* Leaderboard Component */}
      {loading ? (
        <div className={`text-center p-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Loading leaderboard...
        </div>
      ) : (
        <Leaderboard
          players={players}              // Pass enriched data directly
          currentUserId={currentUser?.username}  // Highlight current user
          limit={10}
          onSelect={(player) => {
            console.log('Selected player:', player);
          }}
        />
      )}
    </div>
  );
}