const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/games', express.static(path.join(__dirname, 'public/games')));

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
    scanAddGames();
  });
}

// Seed database
function seedDatabase() {
  // Seed users
  db.run(`INSERT OR IGNORE INTO users (username, email, blazer_id, profile_picture) VALUES 
    ('user1', 'user1@uab.edu', 'user1', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687'),
    ('user2', 'user2@uab.edu', 'user2', 'https://images.unsplash.com/photo-1760681557681-457694845c7d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDN8SnBnNktpZGwtSGt8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500'),
    ('user3', 'user3@uab.edu', 'user3', 'https://images.unsplash.com/photo-1760517340115-7019ac6f3666?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDU1fEpwZzZLaWRsLUhrfHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=500')
    `);
      
  // Seed test scores
  db.get('SELECT COUNT(*) as count FROM scores', (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO scores (username, game_id, score) VALUES 
        ('user1', 1, 350),
        ('user2', 1, 600),
        ('user3', 1, 250)
      `);
    }
  });
}

// scan games and add them from public games folder
function scanAddGames() {
  const gamesDir = path.join(__dirname, 'public/games');
  
  // Check if games directory exists
  if (!fs.existsSync(gamesDir)) {
    console.log('Games directory does not exist');
    fs.mkdirSync(gamesDir, { recursive: true });
    return;
  }

  // Read all files in the games directory
  const files = fs.readdirSync(gamesDir);
  const zipFiles = files.filter(file => file.endsWith('.zip'));

  console.log(`Found ${zipFiles.length} game(s) in the games folder`);

  zipFiles.forEach(file => {
    const gameName = path.basename(file, '.zip');
    const downloadUrl = `/games/${file}`;
    
    // Check if game already exists in database
    db.get('SELECT id FROM games WHERE download_url = ?', [downloadUrl], (err, row) => {
      if (err) {
        console.error(`Error checking for ${gameName}:`, err);
        return;
      }

      if (!row) {
        // Game doesn't exist, add it
        db.run(
          `INSERT INTO games (title, description, thumbnail, download_url, play_in_browser) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            gameName,
            `Play ${gameName}`, // Default description
            'https://images.unsplash.com/photo-1576086639808-ddfd21aa668c?q=80&w=880&auto=format&fit=crop', // Default thumbnail
            downloadUrl,
            0
          ],
          function(err) {
            if (err) {
              console.error(`Error adding ${gameName}:`, err);
            } else {
              console.log(`Added game: ${gameName} (ID: ${this.lastID})`);
            }
          }
        );
      } else {
        console.log(`Game already exists: ${gameName} (ID: ${row.id})`);
      }
    });
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

// Add a new game 
app.post('/api/games', (req, res) => {
  const { title, description, thumbnail, download_url, play_in_browser } = req.body;

  if (!title || !download_url) {
    return res.status(400).json({ error: 'Title and download_url are required' });
  }

  db.run(
    `INSERT INTO games (title, description, thumbnail, download_url, play_in_browser) 
     VALUES (?, ?, ?, ?, ?)`,
    [title, description, thumbnail, download_url, play_in_browser || 0],
    function(err) {
      if (err) {
        console.error('Error adding game:', err);
        return res.status(500).json({ error: 'Error adding game' });
      }
      res.status(201).json({ 
        message: 'Game added successfully',
        gameId: this.lastID,
        game: {
          id: this.lastID,
          title,
          description,
          thumbnail,
          download_url,
          play_in_browser
        }
      });
    }
  );
});

// Update a game 
app.put('/api/games/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, thumbnail, download_url, play_in_browser } = req.body;

  db.run(
    `UPDATE games 
     SET title = ?, description = ?, thumbnail = ?, download_url = ?, play_in_browser = ?
     WHERE id = ?`,
    [title, description, thumbnail, download_url, play_in_browser, id],
    function(err) {
      if (err) {
        console.error('Error updating game:', err);
        return res.status(500).json({ error: 'Error updating game' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Game not found' });
      }
      res.json({ message: 'Game updated successfully' });
    }
  );
});

// Delete a game 
app.delete('/api/games/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM games WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting game:', err);
      return res.status(500).json({ error: 'Error deleting game' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
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
/*
  this will replace score ^^^ for the showcase, should be able to play the game and
  enter name that game file will send to here so it can update the leaderboard

  
  app.post('/api/scores', (req, res) => {
  const { username, gameId, score } = req.body;

  if (!username || !gameId || score === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // First, check if user exists, if not create them
  db.get('SELECT username FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    // If user doesn't exist, create them
    if (!user) {
      db.run(
        `INSERT INTO users (username, email, blazer_id, profile_picture) VALUES (?, ?, ?, ?)`,
        [
          username,
          `${username}@guest.com`, // Default email
          username, // Use username as blazer_id
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400' // Default 
        ],
        (insertErr) => {
          if (insertErr) {
            console.error('Error creating user:', insertErr);
          } else {
            console.log(`New user created: ${username}`);
          }
        }
      );
    }

    // Now insert the score (regardless of whether user existed or was just created)
    db.run(
      'INSERT INTO scores (username, game_id, score) VALUES (?, ?, ?)',
      [username, gameId, score],
      function(err) {
        if (err) {
          console.error('Error saving score:', err);
          return res.status(500).json({ error: 'Error saving score' });
        }
        
        console.log(`Score saved: ${username} scored ${score} in game ${gameId}`);
        
        res.status(201).json({ 
          message: 'Score saved successfully',
          scoreId: this.lastID,
          score,
          username
        });
      }
    );
  });
}); */

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
  console.log('Games folder: public/games');
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
