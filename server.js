const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Initialize SQLite database
const db = new sqlite3.Database('hangman.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            score INTEGER NOT NULL
        )`, [], (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the `public` directory
app.use(express.static(path.join(__dirname, 'public')));

// Redirect the base URL to login.html
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Route to handle score submissions
app.post('/submit-score', (req, res) => {
    const { username, score } = req.body;
    if (typeof username === 'string' && typeof score === 'number') {
        const stmt = db.prepare('INSERT INTO scores (username, score) VALUES (?, ?)');
        stmt.run(username, score, function(err) {
            if (err) {
                res.status(500).send({ error: err.message });
            } else {
                res.status(201).send({ id: this.lastID });
            }
        });
        stmt.finalize();
    } else {
        res.status(400).send({ error: 'Invalid username or score' });
    }
});

// Route to get words - replace with file reading if necessary
app.get('/get-words', (req, res) => {
    // For simplicity, we're returning a static array of words
    // You would replace this with file reading logic if needed
    const words = [
        "aperture", "exposure", "shutter", "lens",
        "sensor", "memorycard", "megapixels", "macro",
        "flash", "tripod", "filter", "bracketing",
        "portrait", "landscape", "telephoto", "panorama",
        "selfie", "wideangle", "zoom", "composition"
    ];
    res.json(words);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Graceful shutdown and cleanup
process.on('SIGINT', () => {
    db.close(() => {
        console.log('Database connection closed due to app termination');
        process.exit(0);
    });
});