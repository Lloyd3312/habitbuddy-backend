require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

let fakeDB = {}; // simple in-memory store for dev only

// Root route
app.get('/', (req, res) => {
  res.send('Hello! Your Habit Tracker API is running.');
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/habits', (req, res) => {
  const user = req.query.user || 'default';
  res.json(fakeDB[user] || []);
});

app.post('/habits', (req, res) => {
  const { user = 'default', habit } = req.body;
  if (!habit) return res.status(400).json({ error: 'habit is required' });
  fakeDB[user] = fakeDB[user] || [];
  const item = { id: Date.now(), habit, done: false };
  fakeDB[user].push(item);
  res.status(201).json(item);
});

app.post('/habits/:id/toggle', (req, res) => {
  const user = req.body.user || 'default';
  const id = Number(req.params.id);
  if (!fakeDB[user]) return res.status(404).send();
  const h = fakeDB[user].find(x => x.id === id);
  if (!h) return res.status(404).send();
  h.done = !h.done;
  res.json(h);
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
