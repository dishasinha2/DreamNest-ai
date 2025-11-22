// -------------------- IMPORTS --------------------

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());

// -------------------- DATABASE --------------------
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dreamnestai'
};

// -------------------- AUTH MIDDLEWARE --------------------
const authenticateToken = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ error: 'Token required' });

    const token = header.split(' ')[1];
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'dreamnest_secret');
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// -------------------- TEST DB --------------------
app.get('/api/test-db', async (_req, res) => {
    try {
        const c = await mysql.createConnection(dbConfig);
        await c.execute('SELECT 1');
        await c.end();
        res.json({ message: 'Database connected successfully!' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// -------------------- REGISTER --------------------
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const c = await mysql.createConnection(dbConfig);
        const [exists] = await c.execute('SELECT id FROM users WHERE email=?', [email]);

        if (exists.length) return res.status(400).json({ error: 'User exists' });

        const hashed = await bcrypt.hash(password, 10);
        const [result] = await c.execute(
            'INSERT INTO users (name,email,password) VALUES (?,?,?)',
            [name, email, hashed]
        );

        const token = jwt.sign(
            { userId: result.insertId, email },
            process.env.JWT_SECRET || 'dreamnest_secret',
            { expiresIn: '24h' }
        );

        await c.end();
        res.json({ message: 'Registered', token });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------- LOGIN --------------------
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const c = await mysql.createConnection(dbConfig);
        const [rows] = await c.execute('SELECT * FROM users WHERE email=?', [email]);

        if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password);

        if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'dreamnest_secret',
            { expiresIn: '24h' }
        );

        await c.end();
        res.json({ message: 'Login OK', token, user });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------- CREATE PROJECT --------------------
app.post('/api/projects', authenticateToken, async (req, res) => {
    try {
        const { project_name, property_type, budget, style_preference, location, area_sqft } = req.body;

        const c = await mysql.createConnection(dbConfig);
        const [result] = await c.execute(
            `INSERT INTO projects (user_id, project_name, property_type, budget, style_preference, location, area_sqft)
             VALUES (?,?,?,?,?,?,?)`,
            [req.user.userId, project_name, property_type, budget, style_preference, location, area_sqft]
        );

        await c.end();
        res.json({ message: 'Project created', projectId: result.insertId });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------- GET PROJECTS --------------------
app.get('/api/projects', authenticateToken, async (req, res) => {
    try {
        const c = await mysql.createConnection(dbConfig);
        const [rows] = await c.execute('SELECT * FROM projects WHERE user_id=?', [req.user.userId]);
        await c.end();
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------- FURNITURE --------------------
app.get('/api/furniture-recommendations', async (req, res) => {
    try {
        const { room_type, style, max_price } = req.query;

        let q = 'SELECT * FROM furniture_recommendations WHERE 1=1';
        const p = [];

        if (room_type && room_type !== 'all') { q += ' AND room_type=?'; p.push(room_type); }
        if (style && style !== 'all') { q += ' AND style=?'; p.push(style); }
        if (max_price) { q += ' AND price_range <= ?'; p.push(max_price); }

        q += ' ORDER BY price_range ASC';

        const c = await mysql.createConnection(dbConfig);
        const [rows] = await c.execute(q, p);
        await c.end();

        res.json(rows);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------- VENDORS --------------------
app.get('/api/vendors', async (req, res) => {
    try {
        const { location, service_type } = req.query;

        let q = 'SELECT * FROM vendors WHERE 1=1';
        const p = [];

        if (location) { q += ' AND location LIKE ?'; p.push(`%${location}%`); }
        if (service_type && service_type !== 'all') { q += ' AND service_type=?'; p.push(service_type); }

        q += ' ORDER BY rating DESC';

        const c = await mysql.createConnection(dbConfig);
        const [rows] = await c.execute(q, p);
        await c.end();

        res.json(rows);

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------- RECOMMENDATIONS ENGINE --------------------
app.post('/api/recommendations', async (req, res) => {
    try {
        const { total_budget, style, location, rooms } = req.body;

        const c = await mysql.createConnection(dbConfig);

        const roomAlloc = {
            living_room: 0.25,
            bedroom: 0.30,
            kitchen: 0.20,
            bathroom: 0.15,
            dining_room: 0.10,
        };

        const perRoom = rooms.map(r => ({
            type: r.type,
            budget: Math.round(total_budget * (roomAlloc[r.type] || 0.10))
        }));

        const furnitureByRoom = {};

        for (const r of perRoom) {
            const [rows] = await c.execute(
                `SELECT * FROM furniture_recommendations
                 WHERE room_type=? AND price_range <= ?
                 ORDER BY price_range DESC LIMIT 8`,
                [r.type, r.budget]
            );
            furnitureByRoom[r.type] = rows;
        }

        const [vendors] = await c.execute(
            `SELECT * FROM vendors WHERE location LIKE ? ORDER BY rating DESC LIMIT 12`,
            [`%${location}%`]
        );

        await c.end();

        const summary = {
            total_budget,
            allocation: perRoom,
            contingency: Math.round(total_budget * 0.10),
        };

        res.json({ summary, furnitureByRoom, vendors });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------- SAVE PLAN --------------------
app.post('/api/save-plan', authenticateToken, async (req, res) => {
    try {
        const { project_name, property_type, budget, style, location, area_sqft, recommendations } = req.body;

        const c = await mysql.createConnection(dbConfig);

        const [p] = await c.execute(
            `INSERT INTO projects (user_id, project_name, property_type, budget, style_preference, location, area_sqft)
             VALUES (?,?,?,?,?,?,?)`,
            [req.user.userId, project_name, property_type, budget, style, location, area_sqft]
        );

        const projectId = p.insertId;

        await c.end();
        res.json({ message: 'Plan saved', projectId });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
    console.log(`🚀 DreamNestAI Backend running on http://localhost:${PORT}`);
});
import ProjectCreation from "./components/ProjectCreation";

<Routes>
    <Route path="/create-project" element={<ProjectCreation />} />
</Routes>
