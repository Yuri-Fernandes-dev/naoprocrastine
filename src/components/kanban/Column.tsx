import React from 'react';
import Task from './Task';
import { Column as ColumnType, Task as TaskType, TaskStatus } from '../../types';
import { columnColors } from '../../utils/colors';
import { useTaskContext } from '../../contexts/TaskContext';
import { Trash2 } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  onDragStart: (taskId: string, sourceStatus: TaskStatus) => void;
  onDragOver: (e: React.DragOverEvent) => void;
  onDrop: () => void;
}

const Column: React.FC<ColumnProps> = ({ column, onDragStart, onDragOver, onDrop }) => {
  const { deleteCompletedTasks } = useTaskContext();
  const colorClasses = columnColors[column.id];

  return (
    <div 
      className={`flex flex-col h-full ${colorClasses.bg} border ${colorClasses.border} rounded-lg overflow-hidden transition-all duration-300`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className={`p-3 ${colorClasses.header} transition-colors`}>
        <h3 className="font-medium">{column.title}</h3>
        <div className="text-sm opacity-90">{column.tasks.length} task{column.tasks.length !== 1 ? 's' : ''}</div>
        {column.id === 'done' && column.tasks.length > 0 && (
          <button
            onClick={deleteCompletedTasks}
            className="text-white hover:text-red-200 transition-colors"
            title="Limpar tarefas concluídas"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div className="flex-grow p-3 overflow-y-auto">
        {column.tasks.length === 0 ? (
          <div className="flex items-center justify-center h-24 border border-dashed rounded-md bg-white bg-opacity-60 text-gray-500 text-sm">
            No tasks yet
          </div>
        ) : (
          <div className="space-y-3">
            {column.tasks.map(task => (
              <Task 
                key={task.id}
                task={task}
                onDragStart={() => onDragStart(task.id, task.status)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;