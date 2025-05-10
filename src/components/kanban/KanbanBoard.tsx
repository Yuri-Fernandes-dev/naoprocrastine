import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Column from './Column';
import TaskModal from './TaskModal';
import { useTaskContext } from '../../contexts/TaskContext';
import { Task, TaskStatus } from '../../types';

const KanbanBoard: React.FC = () => {
  const { columns, moveTask, isLoading } = useTaskContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [draggingSource, setDraggingSource] = useState<TaskStatus | null>(null);

  const handleDragStart = (taskId: string, sourceStatus: TaskStatus) => {
    setDraggingTask(taskId);
    setDraggingSource(sourceStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetStatus: TaskStatus) => {
    if (draggingTask && draggingSource) {
      try {
        await moveTask(draggingTask, draggingSource, targetStatus);
      } catch (error) {
        console.error('Error moving task:', error);
      }
    }
    setDraggingTask(null);
    setDraggingSource(null);
  };

  return (
    <div className="h-full flex flex-col relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div className="px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Task Board</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <Plus size={18} className="mr-1" />
          Add Task
        </button>
      </div>

      <div className="flex-grow p-6 overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {columns.map(column => (
            <Column
              key={column.id}
              column={column}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <TaskModal 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default KanbanBoard;