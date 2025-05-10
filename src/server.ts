import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { database } from './services/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rotas para tarefas
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = database.getTasks();
    console.log('Tasks retrieved:', tasks);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const task = req.body;
    console.log('Adding task:', task);
    database.addTask(task);
    res.json(task);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const task = req.body;
    console.log('Updating task:', task);
    database.updateTask(task);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting task:', id);
    database.deleteTask(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Rotas para estatísticas
app.get('/api/stats', (req, res) => {
  try {
    const stats = database.getStats();
    console.log('Stats retrieved:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/stats', (req, res) => {
  try {
    const stats = req.body;
    console.log('Updating stats:', stats);
    database.updateStats(stats);
    res.json(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 