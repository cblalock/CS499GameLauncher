export default function Achievements({ achievements, activeGame, setActiveGame, games, darkMode }) {
  return (
    <section>
      <h2 className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-white"}`}>
        🏅 Achievements for {activeGame}
      </h2>

      <div className="mb-4">
        <label className={`font-semibold mr-2 ${darkMode ? "text-white" : "text-white"}`}>Select Game:</label>
        <select
          className={`p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-800 text-white"}`}
          value={activeGame || ""}
          onChange={(e) => setActiveGame(e.target.value)}
        >
          {games.map((game) => (
            <option key={game.id} value={game.title}>{game.title}</option>
          ))}
        </select>
      </div>

      {achievements.length === 0 ? (
        <p className={`${darkMode ? "text-gray-300" : "text-white"}`}>No achievements data found for this game.</p>
      ) : (
        <>
          <h3 className={`text-xl font-semibold mt-6 mb-2 ${darkMode ? "text-green-300" : "text-green-300"}`}>✅ Earned</h3>
          {achievements.filter(a => a.earned).map(a => (
            <div key={a.id} className={`p-3 rounded-lg mb-2 ${darkMode ? "bg-gray-600" : "bg-green-800"}`}>
              <strong className={`${darkMode ? "text-white" : "text-yellow-400"}`}>{a.name}</strong> — {a.description}
              <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-300"}`}>{a.current}/{a.total} ({Math.floor((a.current / a.total)*100)}%)</div>
            </div>
          ))}

          <h3 className={`text-xl font-semibold mt-6 mb-2 ${darkMode ? "text-gray-300" : "text-yellow-400"}`}>🔒 Locked</h3>
          {achievements.filter(a => !a.earned).map(a => (
            <div key={a.id} className={`p-3 rounded-lg mb-2 ${darkMode ? "bg-gray-700" : "bg-gray-700"}`}>
              <strong className={`${darkMode ? "text-white" : "text-white"}`}>{a.name}</strong> — {a.description}
              <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-300"}`}>{a.current}/{a.total} ({Math.floor((a.current / a.total)*100)}%)</div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}

