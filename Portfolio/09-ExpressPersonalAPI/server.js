
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname)); // Serve 

// In-memory data storage
let persons_to_greet = [];
let tasks = [];

// static is './html'

// Get all persons
app.get('/api/persons', (req, res) => {
  res.json({ persons: persons_to_greet });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json({ tasks });
});

// Add person(s) via GET (for form compatibility)
app.get('/api/greet', (req, res) => {
  const name = req.query.name;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const new_elements = name.trim().split(/\s+/);
  persons_to_greet = [...persons_to_greet, ...new_elements];
  console.log('Greetings! ' + new_elements.join(', '));

  res.json({ success: true, persons: persons_to_greet });
});

// Validate person exists
app.get('/api/validate-person', (req, res) => {
  const name = req.query.name;

  if (!name || !persons_to_greet.includes(name)) {
    return res.status(404).json({ error: 'Person not found in the list' });
  }

  res.json({ success: true, name });
});

// Add task
app.post('/api/task', (req, res) => {
  const { description, priority } = req.body;
  const priorityNum = parseInt(priority);

  if (!description || description.trim() === '') {
    return res.status(400).json({ error: 'Task description is required' });
  }

  if (isNaN(priorityNum) || priorityNum < 0 || priorityNum > 3) {
    return res.status(400).json({ error: 'Invalid priority value' });
  }

  tasks.push({ description: description.trim(), priority: priorityNum });
  console.log('Task added:', description, 'Priority:', priorityNum);

  res.json({ success: true, tasks });
});

// Swap tasks
app.post('/api/task/swap', (req, res) => {
  const { l_idx, r_idx } = req.body;

  if (l_idx < 0 || r_idx < 0 || l_idx >= tasks.length || r_idx >= tasks.length) {
    return res.status(400).json({ error: 'Invalid task indices for swap' });
  }

  [tasks[l_idx], tasks[r_idx]] = [tasks[r_idx], tasks[l_idx]];
  console.log(`Swapped tasks ${l_idx} and ${r_idx}`);

  res.json({ success: true, tasks });
});

// Delete task
app.delete('/api/task', (req, res) => {
  const id = parseInt(req.query.id);

  if (isNaN(id) || id < 0 || id >= tasks.length) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const removed = tasks.splice(id, 1);
  console.log('Task deleted:', removed[0].description);

  res.json({ success: true, tasks });
});

// PUT method for adding person (Postman only)
app.put('/greet', (req, res) => {
  const name = req.query.name;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const new_elements = name.trim().split(/\s+/);
  persons_to_greet = [...persons_to_greet, ...new_elements];
  console.log('Added via PUT:', new_elements.join(', '));

  res.json({ names: persons_to_greet });
});

// GET /task for Postman (returns all tasks)
app.get('/task', (req, res) => {
  res.json(tasks);
});

// ============================================================================
// HTML ROUTES
// ============================================================================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/wazzup', (req, res) => {
  res.sendFile(path.join(__dirname, 'wazzup.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h1>404 - Not Found</h1><a href="/">Go Home</a>');
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
