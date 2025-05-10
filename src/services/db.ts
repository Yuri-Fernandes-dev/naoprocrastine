import Dexie, { Table } from 'dexie';
import { Task, AppStats } from '../types';

class FocusFlowDB extends Dexie {
  tasks!: Table<Task>;
  stats!: Table<AppStats>;

  constructor() {
    super('FocusFlowDB');
    
    // Definir o schema do banco de dados
    this.version(1).stores({
      tasks: 'id, status, priority, createdAt, updatedAt',
      stats: '++id' // Auto-incrementing primary key
    });
  }
}

const db = new FocusFlowDB();

// Inicializar as estatísticas se não existirem
async function initializeStats() {
  const statsCount = await db.stats.count();
  if (statsCount === 0) {
    await db.stats.add({
      tasksCompleted: 0,
      pomodorosCompleted: 0,
      totalFocusTime: 0,
    });
  }
}

// Chamar a inicialização
initializeStats().catch(error => {
  console.error('Error initializing stats:', error);
});

export const dbService = {
  async getTasks(): Promise<Task[]> {
    try {
      return await db.tasks.orderBy('createdAt').reverse().toArray();
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  async addTask(task: Task): Promise<void> {
    try {
      await db.tasks.add(task);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  async updateTask(task: Task): Promise<void> {
    try {
      await db.tasks.put(task);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(taskId: string): Promise<void> {
    try {
      await db.tasks.delete(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  async deleteCompletedTasks(): Promise<void> {
    try {
      await db.tasks.where('status').equals('done').delete();
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
      throw error;
    }
  },

  async getStats(): Promise<AppStats> {
    try {
      const stats = await db.stats.toArray();
      return stats[0] || {
        tasksCompleted: 0,
        pomodorosCompleted: 0,
        totalFocusTime: 0,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        tasksCompleted: 0,
        pomodorosCompleted: 0,
        totalFocusTime: 0,
      };
    }
  },

  async updateStats(newStats: AppStats): Promise<void> {
    try {
      const stats = await this.getStats();
      if (stats) {
        await db.stats.where('id').equals(1).modify(newStats);
      } else {
        await db.stats.add(newStats);
      }
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  },

  async resetStats(): Promise<void> {
    try {
      await db.stats.where('id').equals(1).modify({
        tasksCompleted: 0,
        pomodorosCompleted: 0,
        totalFocusTime: 0,
      });
    } catch (error) {
      console.error('Error resetting stats:', error);
      throw error;
    }
  },

  async resetPomodoroStats(): Promise<void> {
    try {
      const stats = await this.getStats();
      await db.stats.where('id').equals(1).modify({
        ...stats,
        pomodorosCompleted: 0,
        totalFocusTime: 0,
      });
    } catch (error) {
      console.error('Error resetting pomodoro stats:', error);
      throw error;
    }
  },

  // Método para limpar todo o banco de dados (útil para testes ou reset completo)
  async clearDatabase(): Promise<void> {
    try {
      await db.delete();
      await db.open();
      await initializeStats();
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  },
}; 