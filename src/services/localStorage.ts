import { Task, AppStats } from '../types';

const TASKS_KEY = 'focus-flow-tasks';
const STATS_KEY = 'focus-flow-stats';

const defaultStats: AppStats = {
  tasksCompleted: 0,
  pomodorosCompleted: 0,
  totalFocusTime: 0,
};

export const storage = {
  getTasks(): Task[] {
    try {
      const tasks = localStorage.getItem(TASKS_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error getting tasks from localStorage:', error);
      return [];
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  },

  addTask(task: Task): void {
    try {
      const tasks = this.getTasks();
      tasks.push(task);
      this.saveTasks(tasks);
    } catch (error) {
      console.error('Error adding task to localStorage:', error);
      throw error;
    }
  },

  updateTask(updatedTask: Task): void {
    try {
      const tasks = this.getTasks();
      const index = tasks.findIndex(task => task.id === updatedTask.id);
      if (index !== -1) {
        tasks[index] = updatedTask;
        this.saveTasks(tasks);
      }
    } catch (error) {
      console.error('Error updating task in localStorage:', error);
      throw error;
    }
  },

  deleteTask(taskId: string): void {
    try {
      const tasks = this.getTasks();
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      this.saveTasks(filteredTasks);
    } catch (error) {
      console.error('Error deleting task from localStorage:', error);
      throw error;
    }
  },

  deleteCompletedTasks(): void {
    try {
      const tasks = this.getTasks();
      const filteredTasks = tasks.filter(task => task.status !== 'done');
      this.saveTasks(filteredTasks);
    } catch (error) {
      console.error('Error deleting completed tasks from localStorage:', error);
      throw error;
    }
  },

  getStats(): AppStats {
    try {
      const stats = localStorage.getItem(STATS_KEY);
      return stats ? JSON.parse(stats) : defaultStats;
    } catch (error) {
      console.error('Error getting stats from localStorage:', error);
      return defaultStats;
    }
  },

  updateStats(stats: AppStats): void {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error updating stats in localStorage:', error);
      throw error;
    }
  },

  resetStats(): void {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(defaultStats));
    } catch (error) {
      console.error('Error resetting stats in localStorage:', error);
      throw error;
    }
  },

  resetPomodoroStats(): void {
    try {
      const stats = this.getStats();
      const newStats = {
        ...stats,
        pomodorosCompleted: 0,
        totalFocusTime: 0,
      };
      this.updateStats(newStats);
    } catch (error) {
      console.error('Error resetting pomodoro stats in localStorage:', error);
      throw error;
    }
  },
}; 