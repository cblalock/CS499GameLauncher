import { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";

export default function LeaderboardPage({ currentUser, darkMode }) {
  const [selectedGame, setSelectedGame] = useState(null); // Start with null until games load
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gamesLoading, setGamesLoading] = useState(true);

  // Fetch games list on mount
  useEffect(() => {
    setGamesLoading(true);
    fetch('http://localhost:3000/api/games')
      .then((res) => res.json())
      .then((data) => {
        console.log('Games data from backend:', data);
        setGames(data);
        // Set first game as default
        if (data.length > 0) {
          setSelectedGame(data[0].id);
        }
      })
      .catch((error) => {
        console.error('Error fetching games:', error);
        setGames([]);
      })
      .finally(() => {
        setGamesLoading(false);
      });
  }, []);

  // Fetch leaderboard data when selectedGame changes
  useEffect(() => {
    if (selectedGame === null) return; // Don't fetch if no game selected yet
    
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
        {gamesLoading ? (
          <div className={`p-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Loading games...
          </div>
        ) : games.length === 0 ? (
          <div className={`p-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No games available
          </div>
        ) : (
          <select
            value={selectedGame || ''}
            onChange={(e) => setSelectedGame(Number(e.target.value))}
            className={`p-3 rounded-lg border w-half ${
              darkMode 
                ? 'bg-gray-700 text-white border-gray-600' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
          </select>
        )}
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