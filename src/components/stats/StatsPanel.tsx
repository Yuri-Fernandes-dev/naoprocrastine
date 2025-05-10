import React from 'react';
import { useTaskContext } from '../../contexts/TaskContext';
import { formatTime } from '../../utils/helpers';
import { Trash2 } from 'lucide-react';

const StatsPanel: React.FC = () => {
  const { stats, resetStats, resetPomodoroStats } = useTaskContext();

  const handleResetAll = async () => {
    if (window.confirm('Tem certeza que deseja resetar todas as estatísticas? Esta ação não pode ser desfeita.')) {
      await resetStats();
    }
  };

  const handleResetPomodoro = async () => {
    if (window.confirm('Tem certeza que deseja resetar apenas as estatísticas do Pomodoro? As tarefas concluídas serão mantidas.')) {
      await resetPomodoroStats();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Estatísticas</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleResetPomodoro}
            className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded flex items-center"
            title="Resetar estatísticas do Pomodoro"
          >
            <Trash2 size={16} />
            <span className="ml-1 text-sm">Pomodoro</span>
          </button>
          <button
            onClick={handleResetAll}
            className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded flex items-center"
            title="Resetar todas as estatísticas"
          >
            <Trash2 size={16} />
            <span className="ml-1 text-sm">Tudo</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tarefas Concluídas:</span>
          <span className="font-medium text-gray-800">{stats.tasksCompleted}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Pomodoros Completados:</span>
          <span className="font-medium text-gray-800">{stats.pomodorosCompleted}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tempo Total Focado:</span>
          <span className="font-medium text-gray-800">{formatTime(stats.totalFocusTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 