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

    // ==== FRIENDS TABLE ====
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
  });
}

// Seed database
function seedDatabase() {
  // Seed users
  db.run(`INSERT OR IGNORE INTO users (username, email, blazer_id, profile_picture) VALUES 
    ('user1', 'user1@uab.edu', 'user1', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.1.0&ixid=M3wxM
`;

// Add friends system endpoints

// Get friends list
app.get('/friends/:username', (req, res) => {
  const { username } = req.params;
  const query = `
    SELECT f.id, f.requester, f.receiver, f.status, u.profile_picture
    FROM friends f
    JOIN users u ON (u.username = f.requester OR u.username = f.receiver)
    WHERE (f.requester = ? OR f.receiver = ?) AND f.status = 'accepted' AND u.username != ?
  `;

  db.all(query, [username, username, username], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch friends list' });
    } else {
      res.json(rows);
    }
  });
});

// Send friend request
app.post('/friends/request', (req, res) => {
  const { requester, receiver } = req.body;
  const query = `INSERT INTO friends (requester, receiver, status) VALUES (?, ?, 'pending')`;

  db.run(query, [requester, receiver], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to send friend request' });
    } else {
      res.json({ message: 'Friend request sent', id: this.lastID });
    }
  });
});

// Respond to friend request
app.put('/friends/respond', (req, res) => {
  const { id, status } = req.body;
  const query = `UPDATE friends SET status = ? WHERE id = ?`;

  db.run(query, [status, id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to respond to friend request' });
    } else {
      res.json({ message: 'Friend request updated' });
    }
  });
});

// Remove friend
app.delete('/friends/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM friends WHERE id = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to remove friend' });
    } else {
      res.json({ message: 'Friend removed' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
