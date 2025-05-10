export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsBeforeLongBreak: number;
}

export interface AppStats {
  id?: number;
  tasksCompleted: number;
  pomodorosCompleted: number;
  totalFocusTime: number; // in minutes
}

export interface TaskProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}