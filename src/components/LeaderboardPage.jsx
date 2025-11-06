import { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";

export default function LeaderboardPage({ currentUser, darkMode }) {
  const [selectedGame, setSelectedGame] = useState(1); // Default to game 1
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data 
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/api/leaderboard/${selectedGame}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Leaderboard data from backend:', data);
        setPlayers(data);
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
          players={players}              
          currentUserId={currentUser?.username}
          limit={10}
          onSelect={(player) => {
            console.log('Selected player:', player);
          }}
        />
      )}
    </div>
  );
}