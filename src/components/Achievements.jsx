export default function Achievements({ achievements, activeGame, setActiveGame, games, theme }) {
  return (
    <section>
      <h2 className={`text-2xl font-bold mb-4 ${theme?.text || 'text-white'}`}>
        🏅 Achievements for {activeGame}
      </h2>

      <div className="mb-6">
        <label className={`block mb-2 font-semibold ${theme?.text || 'text-white'}`}>Select Game:</label>
        <select
          className={`p-3 rounded-lg border w-half ${'bg-white text-gray-900 border-gray-300'
          }`}
          value={activeGame || ""}
          onChange={(e) => setActiveGame(e.target.value)}
        >
          {games.map((game) => (
            <option key={game.id} value={game.title}>{game.title}</option>
          ))}
        </select>
      </div>

      {achievements.length === 0 ? (
        <p className={`${theme?.textAlt || 'text-gray-300'}`}>No achievements data found for this game.</p>
      ) : (
        <>
          <h3 className={`text-xl font-semibold mt-6 mb-2 ${theme?.text || 'text-white'}`}>✅ Earned</h3>
          {achievements.filter(a => a.earned).map(a => (
            <div key={a.id} className={`p-3 rounded-lg mb-2 ${theme?.earnedBg || 'bg-green-900 bg-opacity-30'}`}>
              <strong className={`${theme?.earnedText || 'text-green-400'}`}>{a.name}</strong> — {a.description}
              <div className={`text-sm ${theme?.textAlt || 'text-gray-300'}`}>{a.current}/{a.total} ({Math.floor((a.current / a.total)*100)}%)</div>
            </div>
          ))}

          <h3 className={`text-xl font-semibold mt-6 mb-2 ${theme?.text || 'text-white'}`}>🔒 Locked</h3>
          {achievements.filter(a => !a.earned).map(a => (
            <div key={a.id} className={`p-3 rounded-lg mb-2 ${theme?.lockedBg || 'bg-gray-800 bg-opacity-30'}`}>
              <strong className={`${theme?.lockedText || 'text-gray-400'}`}>{a.name}</strong> — {a.description}
              <div className={`text-sm ${theme?.textAlt || 'text-gray-300'}`}>{a.current}/{a.total} ({Math.floor((a.current / a.total)*100)}%)</div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}