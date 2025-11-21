const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;
const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'expense-tracker.db');

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'expense-tracker-backend' });
});

app.get('/api/expenses', (req, res) => {
  db.all('SELECT * FROM expenses ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching expenses', err);
      return res.status(500).json({ error: 'Failed to fetch expenses' });
    }
    res.json(rows);
  });
});

app.post('/api/expenses', (req, res) => {
  const { userId, category, amount, currency, note } = req.body;
  if (!userId || !category || typeof amount !== 'number') {
    return res.status(400).json({ error: 'userId, category and numeric amount are required' });
  }
  const sql = `
    INSERT INTO expenses (user_id, category, amount, currency, note)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(sql, [userId, category, amount, currency || 'USD', note || null], function (err) {
    if (err) {
      console.error('Error inserting expense', err);
      return res.status(500).json({ error: 'Failed to create expense' });
    }
    db.get('SELECT * FROM expenses WHERE id = ?', [this.lastID], (err2, row) => {
      if (err2) {
        console.error('Error fetching created expense', err2);
        return res.status(201).json({ id: this.lastID });
      }
      res.status(201).json(row);
    });
  });
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM expenses WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting expense', err);
      return res.status(500).json({ error: 'Failed to delete expense' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ success: true });
  });
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Expense Tracker backend listening on port ${PORT}`);
});
