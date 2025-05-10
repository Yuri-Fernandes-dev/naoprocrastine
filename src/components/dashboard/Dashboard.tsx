import React from 'react';
import StatCard from './StatCard';
import { useTaskContext } from '../../contexts/TaskContext';
import { Clock, CheckCircle, Activity, BarChart2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { columns, stats } = useTaskContext();
  
  const todoCount = columns.find(col => col.id === 'todo')?.tasks.length || 0;
  const inProgressCount = columns.find(col => col.id === 'inProgress')?.tasks.length || 0;
  const doneCount = columns.find(col => col.id === 'done')?.tasks.length || 0;
  
  const totalTasks = todoCount + inProgressCount + doneCount;
  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Tasks Completed"
          value={stats.tasksCompleted.toString()}
          icon={<CheckCircle className="text-green-500" />}
          color="bg-green-100"
        />
        <StatCard 
          title="Pomodoros Completed"
          value={stats.pomodorosCompleted.toString()}
          icon={<Clock className="text-red-500" />}
          color="bg-red-100"
        />
        <StatCard 
          title="Focus Time"
          value={`${stats.totalFocusTime} mins`}
          icon={<Activity className="text-blue-500" />}
          color="bg-blue-100"
        />
        <StatCard 
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={<BarChart2 className="text-purple-500" />}
          color="bg-purple-100"
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Task Distribution</h3>
        <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
          {totalTasks > 0 ? (
            <>
              <div 
                className="h-full bg-blue-500 float-left"
                style={{ width: `${(todoCount / totalTasks) * 100}%` }}
              ></div>
              <div 
                className="h-full bg-purple-500 float-left"
                style={{ width: `${(inProgressCount / totalTasks) * 100}%` }}
              ></div>
              <div 
                className="h-full bg-green-500 float-left"
                style={{ width: `${(doneCount / totalTasks) * 100}%` }}
              ></div>
            </>
          ) : (
            <div className="h-full bg-gray-300 w-full"></div>
          )}
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>To Do ({todoCount})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span>In Progress ({inProgressCount})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Done ({doneCount})</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Productivity Tips</h3>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>Break down large tasks into smaller, manageable chunks</li>
          <li>Use the Pomodoro technique: 25 minutes of focused work followed by a 5-minute break</li>
          <li>Prioritize tasks based on importance and urgency</li>
          <li>Eliminate distractions during focus sessions (silence notifications, close unnecessary tabs)</li>
          <li>Celebrate completing tasks to maintain motivation</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;