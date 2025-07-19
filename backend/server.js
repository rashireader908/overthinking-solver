const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'mindfulness.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Thoughts table
    db.run(`
      CREATE TABLE IF NOT EXISTS thoughts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        ai_response TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Breathing sessions table
    db.run(`
      CREATE TABLE IF NOT EXISTS breathing_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        technique TEXT NOT NULL,
        duration INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Mood entries table
    db.run(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        mood TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    console.log('Database tables initialized');
  });
};

// Initialize database
initDatabase();

// Routes

// Register user
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Insert new user
      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }
          res.status(201).json({ 
            message: 'User created successfully',
            userId: this.lastID 
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    try {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        message: 'Login successful',
        user: userWithoutPassword 
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Save thought
app.post('/api/thoughts', (req, res) => {
  const { userId, content, aiResponse } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: 'User ID and content are required' });
  }

  db.run(
    'INSERT INTO thoughts (user_id, content, ai_response) VALUES (?, ?, ?)',
    [userId, content, aiResponse || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save thought' });
      }
      res.status(201).json({ 
        message: 'Thought saved successfully',
        thoughtId: this.lastID 
      });
    }
  );
});

// Get user thoughts
app.get('/api/thoughts/:userId', (req, res) => {
  const { userId } = req.params;

  db.all(
    'SELECT * FROM thoughts WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, thoughts) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch thoughts' });
      }
      res.json(thoughts);
    }
  );
});

// Save breathing session
app.post('/api/breathing-sessions', (req, res) => {
  const { userId, technique, duration } = req.body;

  if (!userId || !technique || !duration) {
    return res.status(400).json({ error: 'User ID, technique, and duration are required' });
  }

  db.run(
    'INSERT INTO breathing_sessions (user_id, technique, duration) VALUES (?, ?, ?)',
    [userId, technique, duration],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save breathing session' });
      }
      res.status(201).json({ 
        message: 'Breathing session saved successfully',
        sessionId: this.lastID 
      });
    }
  );
});

// Save mood entry
app.post('/api/mood-entries', (req, res) => {
  const { userId, mood, notes } = req.body;

  if (!userId || !mood) {
    return res.status(400).json({ error: 'User ID and mood are required' });
  }

  db.run(
    'INSERT INTO mood_entries (user_id, mood, notes) VALUES (?, ?, ?)',
    [userId, mood, notes || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save mood entry' });
      }
      res.status(201).json({ 
        message: 'Mood entry saved successfully',
        entryId: this.lastID 
      });
    }
  );
});

// Get user mood entries
app.get('/api/mood-entries/:userId', (req, res) => {
  const { userId } = req.params;

  db.all(
    'SELECT * FROM mood_entries WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
    [userId],
    (err, entries) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch mood entries' });
      }
      res.json(entries);
    }
  );
});

// Get user stats
app.get('/api/user-stats/:userId', (req, res) => {
  const { userId } = req.params;

  db.get(
    'SELECT COUNT(*) as thoughtCount FROM thoughts WHERE user_id = ?',
    [userId],
    (err, thoughtResult) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch user stats' });
      }

      db.get(
        'SELECT COUNT(*) as breathingCount FROM breathing_sessions WHERE user_id = ?',
        [userId],
        (err, breathingResult) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch user stats' });
          }

          db.get(
            'SELECT COUNT(*) as moodCount FROM mood_entries WHERE user_id = ?',
            [userId],
            (err, moodResult) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to fetch user stats' });
              }

              res.json({
                thoughtCount: thoughtResult.thoughtCount,
                breathingCount: breathingResult.breathingCount,
                moodCount: moodResult.moodCount
              });
            }
          );
        }
      );
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database file: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
}); 