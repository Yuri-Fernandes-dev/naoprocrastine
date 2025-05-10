import React from 'react';
import { usePomodoroContext } from '../../contexts/PomodoroContext';
import { formatTime } from '../../utils/helpers';

const TimerDisplay: React.FC = () => {
  const { timeRemaining, timerState } = usePomodoroContext();
  
  const getTimerColor = () => {
    switch (timerState) {
      case 'work': return 'text-red-600';
      case 'shortBreak': return 'text-green-600';
      case 'longBreak': return 'text-blue-600';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="text-center mb-6">
      <div className={`text-6xl font-bold ${getTimerColor()}`}>
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default TimerDisplay;