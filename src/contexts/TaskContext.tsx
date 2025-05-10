import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, Column, AppStats } from '../types';
import { columnColors } from '../utils/colors';
import { generateId } from '../utils/helpers';

const API_URL = 'http://localhost:3001/api';

interface TaskContextType {
  columns: Column[];
  stats: AppStats;
  isLoading: boolean;
  setStats: React.Dispatch<React.SetStateAction<AppStats>>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteCompletedTasks: () => Promise<void>;
  moveTask: (taskId: string, sourceStatus: TaskStatus, targetStatus: TaskStatus) => Promise<void>;
  incrementTaskCompleted: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  resetStats: () => Promise<void>;
  resetPomodoroStats: () => Promise<void>;
}

const defaultColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: columnColors.todo.header,
    tasks: [],
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    color: columnColors.inProgress.header,
    tasks: [],
  },
  {
    id: 'done',
    title: 'Done',
    color: columnColors.done.header,
    tasks: [],
  },
];

const defaultStats: AppStats = {
  tasksCompleted: 0,
  pomodorosCompleted: 0,
  totalFocusTime: 0,
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [stats, setStats] = useState<AppStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const tasks = await response.json();
      
      const updatedColumns = defaultColumns.map(column => ({
        ...column,
        tasks: tasks.filter((task: Task) => task.status === column.id),
      }));
      setColumns(updatedColumns);

      const statsResponse = await fetch(`${API_URL}/stats`);
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      const savedStats = await statsResponse.json();
      if (savedStats) {
        setStats(savedStats);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    refreshTasks();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Failed to add task');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      setIsLoading(true);
      const taskToUpdate = {
        ...updatedTask,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_URL}/tasks/${taskToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskToUpdate),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const deleteCompletedTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/tasks/completed/all`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete completed tasks');
      
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting completed tasks:', error);
      throw error;
    }
  };

  const moveTask = async (taskId: string, sourceStatus: TaskStatus, targetStatus: TaskStatus) => {
    if (sourceStatus === targetStatus) return;

    try {
      setIsLoading(true);
      const taskToMove = columns.find(col => col.id === sourceStatus)?.tasks.find(task => task.id === taskId);
      if (!taskToMove) return;

      const updatedTask: Task = {
        ...taskToMove,
        status: targetStatus,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to move task');

      // Atualizar o estado após mover a tarefa
      await refreshTasks();

      // Se a tarefa foi movida para "done", incrementar o contador
      if (targetStatus === 'done' && sourceStatus !== 'done') {
        await incrementTaskCompleted();
      }
    } catch (error) {
      console.error('Error moving task:', error);
      throw error;
    }
  };

  const incrementTaskCompleted = async () => {
    try {
      setIsLoading(true);
      const newStats = {
        ...stats,
        tasksCompleted: stats.tasksCompleted + 1,
      };

      const response = await fetch(`${API_URL}/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStats),
      });

      if (!response.ok) throw new Error('Failed to update stats');
      setStats(newStats);
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/stats/reset`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reset stats');
      const newStats = await response.json();
      setStats(newStats);
    } catch (error) {
      console.error('Error resetting stats:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPomodoroStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/stats/reset-pomodoro`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reset pomodoro stats');
      const newStats = await response.json();
      setStats(newStats);
    } catch (error) {
      console.error('Error resetting pomodoro stats:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    columns,
    stats,
    isLoading,
    setStats,
    addTask,
    updateTask,
    deleteTask,
    deleteCompletedTasks,
    moveTask,
    incrementTaskCompleted,
    refreshTasks,
    resetStats,
    resetPomodoroStats,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};