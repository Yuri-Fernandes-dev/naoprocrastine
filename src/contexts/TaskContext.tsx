import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus, Column, AppStats } from '../types';
import { columnColors } from '../utils/colors';
import { generateId } from '../utils/helpers';
import { db } from '../db';

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
    id: 'doing',
    title: 'In Progress',
    color: columnColors.doing.header,
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
      const tasks = await db.tasks.toArray();
      const savedStats = await db.stats.toArray();
      
      const updatedColumns = defaultColumns.map(column => ({
        ...column,
        tasks: tasks.filter(task => task.status === column.id),
      }));
      setColumns(updatedColumns);

      if (savedStats.length > 0) {
        setStats(savedStats[0]);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const newTask: Task = {
        ...taskData,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date().toISOString(),
      };

      await db.tasks.add(newTask);
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

      await db.tasks.put(taskToUpdate);
      await refreshTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await db.tasks.delete(taskId);
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const deleteCompletedTasks = async () => {
    try {
      setIsLoading(true);
      await db.tasks.where('status').equals('done').delete();
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
      const taskToMove = await db.tasks.get(taskId);
      if (!taskToMove) return;

      const updatedTask: Task = {
        ...taskToMove,
        status: targetStatus,
        updatedAt: new Date().toISOString(),
      };

      await db.tasks.put(updatedTask);
      await refreshTasks();
    } catch (error) {
      console.error('Error moving task:', error);
      throw error;
    }
  };

  const incrementTaskCompleted = async () => {
    try {
      const currentStats = await db.stats.toArray();
      const updatedStats = {
        ...defaultStats,
        ...currentStats[0],
        tasksCompleted: (currentStats[0]?.tasksCompleted || 0) + 1,
      };

      if (currentStats.length > 0) {
        await db.stats.put(updatedStats, currentStats[0].id);
      } else {
        await db.stats.add(updatedStats);
      }

      setStats(updatedStats);
    } catch (error) {
      console.error('Error incrementing tasks completed:', error);
    }
  };

  const resetStats = async () => {
    try {
      await db.stats.clear();
      await db.stats.add(defaultStats);
      setStats(defaultStats);
    } catch (error) {
      console.error('Error resetting stats:', error);
    }
  };

  const resetPomodoroStats = async () => {
    try {
      const currentStats = await db.stats.toArray();
      if (currentStats.length > 0) {
        const updatedStats = {
          ...currentStats[0],
          pomodorosCompleted: 0,
          totalFocusTime: 0,
        };
        await db.stats.put(updatedStats, currentStats[0].id);
        setStats(updatedStats);
      }
    } catch (error) {
      console.error('Error resetting pomodoro stats:', error);
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