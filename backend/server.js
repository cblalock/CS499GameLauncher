const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./launcher.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Create tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY,
        email TEXT,
        blazer_id TEXT,
        profile_picture TEXT
      )
    `);

    // Games table
    db.run(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        thumbnail TEXT,
        download_url TEXT,
        play_in_browser BOOLEAN DEFAULT 0
      )
    `);

    // Scores table
    db.run(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        game_id INTEGER,
        score INTEGER NOT NULL,
        achieved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES games(id),
        FOREIGN KEY (username) REFERENCES users(username)
      )
    `);

    console.log('Database tables initialized');
    seedDatabase();
  });
}

// Seed database
function seedDatabase() {
  db.get('SELECT COUNT(*) as count FROM games', (err, row) => {
    if (row.count === 0) {
      console.log('Seeding database with games...');
      
      // Seed users
      db.run(`INSERT OR IGNORE INTO users (username, email, blazer_id, profile_picture) VALUES 
        ('user1', 'user1@uab.edu', 'user1', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'),
        ('user2', 'user2@uab.edu', 'user2', 'https://images.unsplash.com/photo-1760681557681-457694845c7d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDN8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500'),
        ('user3', 'user3@uab.edu', 'user3', 'https://images.unsplash.com/photo-1760517340115-7019ac6f3666?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDU1fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500')
      `);
      
      // Seed games
      db.run(`INSERT INTO games (id, title, description, thumbnail, download_url, play_in_browser) VALUES 
        (1, 'Glycolysim', 'tetris or something with molecules', 
         'https://images.unsplash.com/photo-1576086639808-ddfd21aa668c?q=80&w=880&auto=format&fit=crop', 
         '/games/Glycolysim.zip', 0),
        (2, 'ImmunoHeroes', 'idk what this game is about either', 
         'https://plus.unsplash.com/premium_photo-1725667172926-0a33e2fc1596?q=80&w=1605&auto=format&fit=crop', 
         '/games/ImmunoHeroes.zip', 0)
      `);

      // Seed test scores
      db.run(`INSERT INTO scores (username, game_id, score) VALUES 
        ('user1', 1, 350),
        ('user1', 2, 500),
        ('user2', 1, 600),
        ('user3', 2, 200),
        ('user3', 1, 900)
      `);

      console.log('Test data seeded');
    }
  });
}

// ==================== API ROUTES ====================

// Get all games
app.get('/api/games', (req, res) => {
  db.all('SELECT * FROM games', (err, games) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(games);
  });
});

// Get users
app.get('/api/users', (req, res) => {
  db.all('SELECT username, email, blazer_id, profile_picture FROM users', (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(users);
  });
});

// Get user's scores
app.get('/api/scores/:username', (req, res) => {
  const { username } = req.params;
  db.all(
    `SELECT g.id as game_id, g.title as game_title, g.thumbnail, MAX(s.score) as high_score
     FROM scores s
     JOIN games g ON s.game_id = g.id
     WHERE s.username = ?
     GROUP BY g.id`,
    [username],
    (err, scores) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(scores);
    }
  );
});

// Submit a score from game
app.post('/api/scores', (req, res) => {
  const { username, gameId, score } = req.body;

  if (!username || !gameId || score === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO scores (username, game_id, score) VALUES (?, ?, ?)',
    [username, gameId, score],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error saving score' });
      }
      res.status(201).json({ 
        message: 'Score saved',
        scoreId: this.lastID,
        score 
      });
    }
  );
});
// leaderboard
app.get('/api/leaderboard/:gameId', (req, res) => {
  const { gameId } = req.params;
  const limit = req.query.limit || 100;

  db.all(
    `SELECT 
       s.username as name,
       s.username as id,
       MAX(s.score) as score,
       u.profile_picture as avatar
     FROM scores s
     LEFT JOIN users u ON s.username = u.username
     WHERE s.game_id = ?
     GROUP BY s.username
     ORDER BY score DESC
     LIMIT ?`,
    [gameId, limit],
    (err, leaderboard) => {
      if (err) {
        console.error('Leaderboard query error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('Leaderboard data:', leaderboard);
      res.json(leaderboard);
    }
  );
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Database: launcher.db`);
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
