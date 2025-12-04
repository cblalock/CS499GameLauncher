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
        play_in_browser BOOLEAN DEFAULT 0,
        department TEXT
      )
    `);

    // Scores table
    db.run(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        game_id INTEGER,
        score INTEGER NOT NULL,
        FOREIGN KEY (game_id) REFERENCES games(id),
        FOREIGN KEY (username) REFERENCES users(username)
      )
    `);

    // Friends table
    db.run(`
      CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        requester TEXT NOT NULL,
        receiver TEXT NOT NULL,
        status TEXT CHECK(status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (requester) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (receiver) REFERENCES users(username) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT unique_friendship UNIQUE(requester, receiver)
      )
    `);

    console.log('Database tables initialized');
    seedDatabase();
    scanAddGames();
    seedFriends(); 
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
        ('user1', 1, 9),
        ('user2', 1, 6),
        ('user3', 1, 12)
      `);
    }
  });
}

// Hardcoded friends
function seedFriends() {
  db.run(`INSERT OR IGNORE INTO friends (requester, receiver, status) VALUES 
    ('user1', 'user3', 'accepted'),
    ('user2', 'user3', 'accepted')
  `, (err) => {
    if (err) {
      console.error('Error seeding friends:', err);
    } else {
      console.log('Hardcoded friends seeded');
    }
  });
}

// scan games and add them
function scanAddGames() {
  const gamesDir = path.join(__dirname, 'public/games');
  
  // Check if games directory exists
  if (!fs.existsSync(gamesDir)) {
    console.log('Games directory does not exist, creating...');
    fs.mkdirSync(gamesDir, { recursive: true });
    return;
  }

  // Read all subdirectories (departments)
  const departments = fs.readdirSync(gamesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${departments.length} department(s): ${departments.join(', ')}`);

  departments.forEach(department => {
    const departmentPath = path.join(gamesDir, department);
    const files = fs.readdirSync(departmentPath);
    const zipFiles = files.filter(file => file.endsWith('.zip'));

    console.log(`  ${department}: ${zipFiles.length} game(s)`);

    zipFiles.forEach(file => {
      const gameName = path.basename(file, '.zip');
      const downloadUrl = `/games/${department}/${file}`;

      db.get('SELECT id FROM games WHERE download_url = ?', [downloadUrl], (err, row) => {
        if (err) return console.error(err);

        if (!row) {
          db.run(
            `INSERT INTO games (title, description, thumbnail, download_url, play_in_browser, department) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              gameName,
              `Play ${gameName}`,
              'https://images.unsplash.com/photo-1576086639808-ddfd21aa668c?auto=format&fit=crop&q=80&w=880',
              downloadUrl,
              0,
              department
            ],
            function(err) {
              if (err) return console.error(err);
              console.log(`Added: ${gameName} (ID: ${this.lastID})`);
            }
          );
        }
      });
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

// POST a new score from glycolysim
app.post('/api/leaderboard', (req, res) => {
  const { player_name, score, game_id, difficulty } = req.body;

  if (!player_name || score === undefined || !game_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Use the scores table 
  const query = `
    INSERT INTO scores (username, score, game_id) 
    VALUES (?, ?, ?)
  `;

  db.run(query, [player_name, score, game_id], function(err) {
    if (err) {
      console.error('Error inserting score:', err);
      return res.status(500).json({ error: 'Failed to save score' });
    }
    
    console.log(`Score saved: ${player_name} - ${score} points (Game ID: ${game_id})`);
    
    res.status(201).json({ 
      message: 'Score added successfully',
      id: this.lastID 
    });
  });
});

// leaderboard for canvas integration (only showing user's max hiscore)
/*app.get('/api/leaderboard/:gameId', (req, res) => {
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
});*/

// leaderboard for showcase (shows every score, some people may have same initials)
app.get('/api/leaderboard/:gameId', (req, res) => {
  const { gameId } = req.params;
  const limit = req.query.limit || 100;

  db.all(
    `SELECT 
       s.id as id,
       s.username as name,
       s.score as score,
       u.profile_picture as avatar
     FROM scores s
     LEFT JOIN users u ON s.username = u.username
     WHERE s.game_id = ?
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

// ==================== FRIENDS ENDPOINTS (ADDED FROM SECOND FILE) ====================

// Get user's friends list
app.get('/friends/:username', (req, res) => {
  const { username } = req.params;
  const query = `
    SELECT f.id, f.requester, f.receiver, f.status, u.profile_picture
    FROM friends f
    JOIN users u ON (u.username = f.requester OR u.username = f.receiver)
    WHERE (f.requester = ? OR f.receiver = ?) 
      AND f.status = 'accepted' 
      AND u.username != ?
  `;

  db.all(query, [username, username, username], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch friends list' });
    res.json(rows);
  });
});

// Send friend request
app.post('/friends/request', (req, res) => {
  const { requester, receiver } = req.body;

  db.run(
    `INSERT INTO friends (requester, receiver, status) VALUES (?, ?, 'pending')`,
    [requester, receiver],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to send friend request' });
      res.json({ message: 'Friend request sent', id: this.lastID });
    }
  );
});

// Respond to friend request (accept/decline)
app.put('/friends/respond', (req, res) => {
  const { id, status } = req.body;

  db.run(
    `UPDATE friends SET status=? WHERE id=?`,
    [status, id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to respond to friend request' });
      res.json({ message: 'Friend request updated' });
    }
  );
});

// Remove friend
app.delete('/friends/:id', (req, res) => {
  db.run(`DELETE FROM friends WHERE id=?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to remove friend' });
    res.json({ message: 'Friend removed' });
  });
});

// Check if user exists
app.get('/api/users/:username', (req, res) => {
  const { username } = req.params;
  db.get(`SELECT COUNT(*) AS count FROM users WHERE username = ?`, [username], (err, row) => {
    if (err) return res.status(500).json({ error: 'Failed to check user existence' });
    res.json({ exists: row.count > 0 });
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT username, email, blazer_id, profile_picture FROM users', (err, users) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(users);
  });
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