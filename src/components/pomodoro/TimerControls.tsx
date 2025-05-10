import React from 'react';
import { Play, Pause, SkipForward, RefreshCw } from 'lucide-react';
import { usePomodoroContext } from '../../contexts/PomodoroContext';

const TimerControls: React.FC = () => {
  const { isActive, startTimer, pauseTimer, resetTimer, skipTimer } = usePomodoroContext();

  return (
    <div className="flex justify-center space-x-4">
      {!isActive ? (
        <button
          onClick={startTimer}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          <Play size={24} fill="currentColor" />
        </button>
      ) : (
        <button
          onClick={pauseTimer}
          className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
        >
          <Pause size={24} />
        </button>
      )}
      
      <button
        onClick={resetTimer}
        className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
      >
        <RefreshCw size={24} />
      </button>
      
      <button
        onClick={skipTimer}
        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
      >
        <SkipForward size={24} />
      </button>
    </div>
  );
};

export default TimerControls;