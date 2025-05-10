import Database from 'better-sqlite3';
import { Task, AppStats } from '../types';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Usar um caminho absoluto para o banco de dados
const dbPath = join(__dirname, '..', '..', 'tasks.db');
console.log('Database path:', dbPath);

const db = new Database(dbPath);

// Habilitar logs do SQLite
db.pragma('foreign_keys = ON');

console.log('Creating database tables...');

// Criar tabelas se não existirem
db.exec(`
  DROP TABLE IF EXISTS tasks;
  DROP TABLE IF EXISTS stats;

  CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    tasks_completed INTEGER DEFAULT 0,
    pomodoros_completed INTEGER DEFAULT 0,
    total_focus_time INTEGER DEFAULT 0
  );
`);

console.log('Tables created successfully');

// Inserir estatísticas iniciais se não existirem
const statsCount = db.prepare('SELECT COUNT(*) as count FROM stats').get() as { count: number };
if (statsCount.count === 0) {
  console.log('Initializing stats table...');
  db.prepare(`
    INSERT INTO stats (id, tasks_completed, pomodoros_completed, total_focus_time)
    VALUES (1, 0, 0, 0)
  `).run();
}

// Preparar statements para melhor performance
const statements = {
  getAllTasks: db.prepare('SELECT * FROM tasks ORDER BY created_at DESC'),
  insertTask: db.prepare(`
    INSERT INTO tasks (id, title, description, status, priority, created_at, updated_at)
    VALUES (@id, @title, @description, @status, @priority, @createdAt, @updatedAt)
  `),
  updateTask: db.prepare(`
    UPDATE tasks
    SET title = @title,
        description = @description,
        status = @status,
        priority = @priority,
        updated_at = @updatedAt
    WHERE id = @id
  `),
  deleteTask: db.prepare('DELETE FROM tasks WHERE id = ?'),
  deleteCompletedTasks: db.prepare('DELETE FROM tasks WHERE status = ?'),
  getStats: db.prepare('SELECT * FROM stats WHERE id = 1'),
  updateStats: db.prepare(`
    UPDATE stats
    SET tasks_completed = @tasksCompleted,
        pomodoros_completed = @pomodorosCompleted,
        total_focus_time = @totalFocusTime
    WHERE id = 1
  `),
  resetStats: db.prepare(`
    UPDATE stats
    SET tasks_completed = 0,
        pomodoros_completed = 0,
        total_focus_time = 0
    WHERE id = 1
  `),
  resetPomodoroStats: db.prepare(`
    UPDATE stats
    SET pomodoros_completed = 0,
        total_focus_time = 0
    WHERE id = 1
  `),
};

export const database = {
  getTasks(): Task[] {
    try {
      console.log('Getting all tasks...');
      const tasks = statements.getAllTasks.all() as any[];
      console.log('Retrieved tasks from DB:', tasks);
      return tasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }));
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  addTask(task: Task): void {
    try {
      console.log('Adding task:', task);
      statements.insertTask.run({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });
      console.log('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  updateTask(task: Task): void {
    try {
      console.log('Updating task:', task);
      statements.updateTask.run({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        updatedAt: task.updatedAt,
      });
      console.log('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask(id: string): void {
    try {
      console.log('Deleting task:', id);
      statements.deleteTask.run(id);
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  deleteCompletedTasks(): void {
    try {
      console.log('Deleting completed tasks');
      statements.deleteCompletedTasks.run('done');
      console.log('Completed tasks deleted successfully');
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
      throw error;
    }
  },

  getStats(): AppStats {
    try {
      console.log('Getting stats...');
      const stats = statements.getStats.get() as any;
      const formattedStats = {
        tasksCompleted: stats.tasks_completed,
        pomodorosCompleted: stats.pomodoros_completed,
        totalFocusTime: stats.total_focus_time
      };
      console.log('Retrieved stats:', formattedStats);
      return formattedStats;
    } catch (error) {
      console.error('Error getting stats:', error);
      return { tasksCompleted: 0, pomodorosCompleted: 0, totalFocusTime: 0 };
    }
  },

  updateStats(stats: AppStats): void {
    try {
      console.log('Updating stats:', stats);
      statements.updateStats.run({
        tasksCompleted: stats.tasksCompleted,
        pomodorosCompleted: stats.pomodorosCompleted,
        totalFocusTime: stats.totalFocusTime,
      });
      console.log('Stats updated successfully');
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  },

  resetStats(): void {
    try {
      console.log('Resetting stats...');
      statements.resetStats.run();
      console.log('Stats reset successfully');
    } catch (error) {
      console.error('Error resetting stats:', error);
      throw error;
    }
  },

  resetPomodoroStats(): void {
    try {
      console.log('Resetting pomodoro stats...');
      statements.resetPomodoroStats.run();
      console.log('Pomodoro stats reset successfully');
    } catch (error) {
      console.error('Error resetting pomodoro stats:', error);
      throw error;
    }
  },
}; 