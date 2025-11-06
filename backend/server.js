const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
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
        FOREIGN KEY (game_id) REFERENCES games(id)
      )
    `);

    console.log('Database tables initialized');
    seedDatabase();
  });
}

// Seed database with your games
function seedDatabase() {
  db.get('SELECT COUNT(*) as count FROM games', (err, row) => {
    if (row.count === 0) {
      console.log('Seeding database with games...');
      
      db.run(`INSERT INTO games (id, title, description, thumbnail, download_url, play_in_browser) VALUES 
        (1, 'Glycolysim', 'tetris or something with molecules', 
         'https://images.unsplash.com/photo-1576086639808-ddfd21aa668c?q=80&w=880&auto=format&fit=crop', 
         '/games/Glycolysim.zip', 0),
        (2, 'ImmunoHeroes', 'idk what this game is about either', 
         'https://plus.unsplash.com/premium_photo-1725667172926-0a33e2fc1596?q=80&w=1605&auto=format&fit=crop', 
         '/games/ImmunoHeroes.zip', 0)
      `);

      // Seed some test scores
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

// Get all games (for your existing games list)
app.get('/api/games', (req, res) => {
  db.all('SELECT * FROM games', (err, games) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(games);
  });
});

// Get user's scores (by username, not ID)
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
  const {gameId} = req.params;
  const limit = req.query.limit || 100;

  db.all(
    `SELECT username as name, username as id, MAX(score) as score
     FROM scores
     WHERE game_id = ?
     GROUP BY username
     ORDER BY score DESC
     LIMIT ?`,
    [gameId, limit],
    (err, leaderboard) => {
      if(err){
        return res.status(500).json({error: 'Database error'});
      }
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
