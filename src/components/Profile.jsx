import { Mail, Trophy, Award, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function Profile({ currentUser, setCurrentUser, games, darkMode }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [backendScores, setBackendScores] = useState(""); // backend scores
  

  useEffect(() => {
  if (currentUser) {
    fetch(`http://localhost:3000/api/scores/${currentUser.username}`)
      .then(res => res.json())
      .then(scores => {
        console.log('Raw scores from backend:', scores);
        const formattedScores = scores.map(score => {
          return {
            gameId: score.game_id,
            gameTitle: score.game_title,
            thumbnail: score.thumbnail,
            highScore: score.high_score
          };
        });
        console.log('Formatted scores:', formattedScores); // testing scores in console
        setBackendScores(formattedScores);
      })
      .catch(err => console.error('Error fetching scores:', err));
  } else {
    setBackendScores([]);
  }
}, [currentUser]);

  // Dummy user accounts
  const users = [
    {
      username: "user1",
      password: "password1",
      profile: {
        name: "user1",
        email: "user1@uab.edu",
        blazerID: "user1",
        profilePicture: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
      }
    },
    {
      username: "user2",
      password: "password2",
      profile: {
        name: "user2",
        email: "user2@uab.edu",
        blazerID: "user2",
        profilePicture: "https://images.unsplash.com/photo-1760681557681-457694845c7d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDN8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500"
      }
    },
    {
      username: "user3",
      password: "password3",
      profile: {
        name: "user3",
        email: "user3@uab.edu",
        blazerID: "user3",
        profilePicture: "https://images.unsplash.com/photo-1760517340115-7019ac6f3666?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDU1fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500"
      }
    }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setUsername("");
      setPassword("");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Calculate user's high scores for each game (from backend in future)
  const getUserHighScores = () => {
    if (backendScores.length > 0) {
      return backendScores;
    }
    return games.map(game => ({
      gameId: game.id,
      gameTitle: game.title,
      thumbnail: game.thumbnail,
      highScore:  0 // no score if not fetched from backend
    }));
  };

  const highScores = getUserHighScores();

  // If not logged in, show login form
  if (!currentUser) {
    return (
      <section className="max-w-md mx-auto">
        <h2 className={`text-3xl font-bold mb-6 text-center ${darkMode ? "text-white" : "text-white"}`}>
          User Log In
        </h2>

        <div className={`rounded-lg p-8 border ${
          darkMode 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white bg-opacity-10 backdrop-blur-md border-yellow-400"
        }`}>
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-white bg-opacity-20"
            }`}>
              <LogIn className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500"
                    : "bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white focus:ring-yellow-400"
                }`}
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500"
                    : "bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white focus:ring-yellow-400"
                }`}
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gradient-to-r from-green-700 to-yellow-500 hover:from-green-600 hover:to-yellow-400"
              }`}
            >
              Sign In
            </button>
          </form>
        </div>
      </section>
    );
  }

  // If logged in, show profile
  const user = currentUser.profile;

  return (
    <section className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-white"}`}>
          My Profile
        </h2>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            darkMode 
              ? "bg-gray-700 hover:bg-gray-600 text-white" 
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* User Info Display */}
      <div className={`rounded-lg p-6 mb-6 border ${
        darkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white bg-opacity-10 backdrop-blur-md border-yellow-400"
      }`}>
        <div className="flex items-center gap-4">
          <img
            src={user.profilePicture}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
          />
          <div>
            <h3 className={`text-2xl font-bold mb-1 ${darkMode ? "text-white" : "text-white"}`}>
              {user.name}
            </h3>
            <div className={`flex items-center gap-2 mb-1 ${darkMode ? "text-white" : "text-white"}`}>
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <div className={`text-sm ${darkMode ? "text-white" : "text-white"}`}>
              Blazer ID: {user.blazerID}
            </div>
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
              <div className={`text-3xl font-bold ${darkMode ? "text-white" : "text-white"}`}>
                {score.highScore}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}