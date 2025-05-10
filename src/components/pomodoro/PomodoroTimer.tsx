import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import SettingsModal from './SettingsModal';
import { usePomodoroContext } from '../../contexts/PomodoroContext';

const PomodoroTimer: React.FC = () => {
  const { timerState, sessionsCompleted } = usePomodoroContext();
  const [showSettings, setShowSettings] = useState(false);

  const getStateLabel = () => {
    switch (timerState) {
      case 'work': return 'Work Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Pomodoro Timer';
    }
  };

  const getStateColor = () => {
    switch (timerState) {
      case 'work': return 'bg-red-500';
      case 'shortBreak': return 'bg-green-500';
      case 'longBreak': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto p-6">
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {getStateLabel()}
          </h2>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="mb-6">
          <div className={`h-2 rounded-full ${getStateColor()}`}></div>
        </div>

        <TimerDisplay />
        
        <TimerControls />
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          Completed sessions: {sessionsCompleted}
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default PomodoroTimer;