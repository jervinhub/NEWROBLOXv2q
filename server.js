const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy: Search Roblox users by username
app.get('/api/users/search', async (req, res) => {
  const { username } = req.query;
  if (!username || username.length < 3) {
    return res.json({ users: [] });
  }
  try {
    const response = await fetch(
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// Proxy: Get user info by userId
app.get('/api/users/:userId', async (req, res) => {
  try {
    const response = await fetch(
      `https://users.roblox.com/v1/users/${req.params.userId}`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});

// Proxy: Get user avatar thumbnail
app.get('/api/avatar/:userId', async (req, res) => {
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${req.params.userId}&size=150x150&format=Png&isCircular=false`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch avatar', details: err.message });
  }
});

// Proxy: Get multiple users by IDs
app.post('/api/users/batch', async (req, res) => {
  try {
    const response = await fetch(
      `https://users.roblox.com/v1/users`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ userIds: req.body.userIds, excludeBannedUsers: false })
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});