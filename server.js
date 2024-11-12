const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('JWT secret key is not defined!');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from 'uploads' directory
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Basic API route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Register route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        try {
            const hash = await bcrypt.hash(password, 10);
            const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(query, [name, email, hash], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error', details: err.message });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        } catch (err) {
            return res.status(500).json({ error: 'Error hashing password', details: err.message });
        }
    });
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id, name: user.name }, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({
            userId: user.id,
            name: user.name,
            email: user.email,
            token: token,
        });
    });
});

// CV upload route
app.post('/api/upload', upload.single('cv'), (req, res) => {
    const { title, description, userId } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !filePath || !userId) {
        return res.status(400).json({ error: 'Title, description, file, and user ID are required' });
    }

    const query = 'INSERT INTO CVs (title, description, file_path, user_id) VALUES (?, ?, ?, ?)';
    db.query(query, [title, description, filePath, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'CV uploaded successfully', cvId: result.insertId });
    });
});

// Retrieve all CVs route
app.get('/api/cvs', (req, res) => {
    const query = `
        SELECT cv.*, u.name as uploadedBy, 
            (SELECT COUNT(*) FROM Likes WHERE Likes.cv_id = cv.id) as likeCount,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('content', Comments.content, 'userName', users.name)) 
             FROM Comments 
             JOIN users ON Comments.user_id = users.id
             WHERE Comments.cv_id = cv.id) as comments
        FROM CVs cv
        JOIN users u ON cv.user_id = u.id
    `;
    db.query(query, (err, cvs) => {
        if (err) {
            console.error('Error fetching CVs:', err);
            return res.status(500).json({ error: 'Failed to fetch CVs' });
        }
        res.json(cvs);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
