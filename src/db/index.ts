import Dexie, { Table } from 'dexie';
import { Task, AppStats } from '../types';

export class AppDatabase extends Dexie {
  tasks!: Table<Task>;
  stats!: Table<AppStats>;

  constructor() {
    super('naoprocrastine');
    this.version(1).stores({
      tasks: 'id, status, createdAt',
      stats: '++id'
    });
  }
}

export const db = new AppDatabase(); 