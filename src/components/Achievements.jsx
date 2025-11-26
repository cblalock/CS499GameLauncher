export default function Achievements({ achievements, activeGame, setActiveGame, games, theme }) {
  return (
    <section>
      <h2 className={`text-2xl font-bold mb-4 ${theme.header}`}>
        🏅 Achievements for {activeGame}
      </h2>

      <div className="mb-4">
        <label className={`font-semibold mr-2 ${theme.text}`}>Select Game:</label>
        <select
          className={`p-2 rounded ${theme.selectBg} ${theme.text}`}
          value={activeGame || ""}
          onChange={(e) => setActiveGame(e.target.value)}
        >
          {games.map((game) => (
            <option key={game.id} value={game.title}>{game.title}</option>
          ))}
        </select>
      </div>

      {achievements.length === 0 ? (
        <p className={`${theme.textAlt}`}>No achievements data found for this game.</p>
      ) : (
        <>
          <h3 className={`text-xl font-semibold mt-6 mb-2 ${theme.earnedHeader}`}>✅ Earned</h3>
          {achievements.filter(a => a.earned).map(a => (
            <div key={a.id} className={`p-3 rounded-lg mb-2 ${theme.earnedBg}`}>
              <strong className={`${theme.earnedText}`}>{a.name}</strong> — {a.description}
              <div className={`text-sm ${theme.textAlt}`}>{a.current}/{a.total} ({Math.floor((a.current / a.total)*100)}%)</div>
            </div>
          ))}

          <h3 className={`text-xl font-semibold mt-6 mb-2 ${theme.lockedHeader}`}>🔒 Locked</h3>
          {achievements.filter(a => !a.earned).map(a => (
            <div key={a.id} className={`p-3 rounded-lg mb-2 ${theme.lockedBg}`}>
              <strong className={`${theme.lockedText}`}>{a.name}</strong> — {a.description}
              <div className={`text-sm ${theme.textAlt}`}>{a.current}/{a.total} ({Math.floor((a.current / a.total)*100)}%)</div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}

