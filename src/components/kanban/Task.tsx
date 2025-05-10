import React, { useState } from 'react';
import { PenLine, Trash2 } from 'lucide-react';
import { Task as TaskType } from '../../types';
import { priorityColors } from '../../utils/colors';
import { formatDate } from '../../utils/helpers';
import { useTaskContext } from '../../contexts/TaskContext';
import TaskModal from './TaskModal';

interface TaskProps {
  task: TaskType;
  onDragStart: () => void;
}

const Task: React.FC<TaskProps> = ({ task, onDragStart }) => {
  const { deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  
  const priorityClass = priorityColors[task.priority];

  return (
    <>
      <div 
        className="bg-white rounded-md shadow-sm border border-gray-200 p-3 cursor-grab hover:shadow-md transition-shadow"
        draggable
        onDragStart={onDragStart}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-800">{task.title}</h4>
          <div className="flex space-x-1">
            <button 
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-500 p-1 rounded transition-colors"
            >
              <PenLine size={14} />
            </button>
            <button 
              onClick={() => deleteTask(task.id)}
              className="text-gray-500 hover:text-red-500 p-1 rounded transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityClass}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(task.updatedAt)}
          </span>
        </div>
      </div>

      {isEditing && (
        <TaskModal 
          onClose={() => setIsEditing(false)}
          task={task}
        />
      )}
    </>
  );
};

export default Task;