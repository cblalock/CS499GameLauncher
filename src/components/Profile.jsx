import { Mail, Trophy, Award } from "lucide-react";

// Dummy profile, future canvas integration
export default function Profile({ games, darkMode }) {
  
  const currentUser = {
    name: "John Doe",
    email: "johndoe@uab.edu",
    blazerID: "jd25",
    profilePicture: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
  };

  // Calculate user's high scores for each game
  const getUserHighScores = () => {
    return games.map(game => ({
      gameId: game.id,
      gameTitle: game.title,
      thumbnail: game.thumbnail,
      highScore: game.score || 0 // This will come from backend
    }));
  };

  // Mock achievement data (will come from backend)
  const userAchievements = [
    {
      id: 1,
      gameTitle: "Glycolysim",
      name: "First Steps",
      description: "Complete your first level",
      icon: "🎯",
      earnedDate: "Oct 17, 2025",
      earned: true
    }
  ];

  const highScores = getUserHighScores();
  const earnedAchievements = userAchievements.filter(a => a.earned);
  

  return (
    <section className="max-w-5xl mx-auto">
      <h2 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-white"}`}>
        My Profile
      </h2>

      {/* User Info Display */}
      <div className={`rounded-lg p-6 mb-6 border ${
        darkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white bg-opacity-10 backdrop-blur-md border-yellow-400"
      }`}>
        <div className="flex items-center gap-4">
          <img
            src={currentUser.profilePicture}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
          />
          <div>
            <h3 className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-white"}`}>
              {currentUser.name}
            </h3>
            <div className={`flex items-center gap-2 mb-1 ${darkMode ? "text-white" : "text-white"}`}>
              <Mail className="w-4 h-4" />
              <span>{currentUser.email}</span>
            </div>
            <div className={`text-sm ${darkMode ? "text-white" : "text-white"}`}>
              Blazer ID: {currentUser.blazerID}
            </div>
          </div>
        </div>
      </div>

      {/* Total number of achievements box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`rounded-lg p-4 text-center border ${
          darkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white bg-opacity-10 backdrop-blur-md border-yellow-400"
        }`}>
          <Trophy className={`w-8 h-8 mx-auto mb-2 ${darkMode ? "text-yellow-400" : "text-yellow-400"}`} />
          <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-white"}`}>
            {earnedAchievements.length}
          </div>
          <div className={`text-sm ${darkMode ? "text-gray-400" : "text-white"}`}>
            Achievements Unlocked
          </div>
        </div>
      </div>

      {/* High Scores Section */}
      <div className={`rounded-lg p-6 mb-6 border ${
        darkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white bg-opacity-10 backdrop-blur-md border-yellow-400"
      }`}>
        <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-white"}`}>
          <Trophy className="w-6 h-6 text-yellow-400" />
          My High Scores
        </h3>
        <div className="space-y-3">
          {highScores.map((score) => (
            <div
              key={score.gameId}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                darkMode 
                  ? "bg-gray-700 border-gray-600" 
                  : "bg-white bg-opacity-5 border-white border-opacity-20"
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={score.thumbnail}
                  alt={score.gameTitle}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <div className={`font-bold text-lg ${darkMode ? "text-white" : "text-white"}`}>
                    {score.gameTitle}
                  </div>
                  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-white"}`}>
                    Personal Best
                  </div>
                </div>
              </div>
              <div className={`text-3xl font-bold ${darkMode ? "text-yellow-400" : "text-white"}`}>
                {score.highScore}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Achievements Section */}
      <div className={`rounded-lg p-6 border ${
        darkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white bg-opacity-10 backdrop-blur-md border-yellow-400"
      }`}>
        <h3 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-white"}`}>
          <Award className="w-6 h-6 text-yellow-400" />
          Completed Achievements
        </h3>

        {earnedAchievements.length === 0 ? (
          <p className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-300"}`}>
            No achievements unlocked yet. Start playing to earn achievements!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {earnedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${
                  darkMode 
                    ? "bg-green-900 bg-opacity-30 border-green-700" 
                    : "bg-green-800 bg-opacity-40 border-green-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className={`font-bold ${darkMode ? "text-white" : "text-white"}`}>
                      {achievement.name}
                    </div>
                    <div className={`text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-200"}`}>
                      {achievement.description}
                    </div>
                    <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-300"}`}>
                      {achievement.gameTitle} • Earned {achievement.earnedDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}