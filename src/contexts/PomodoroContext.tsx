import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PomodoroSettings } from '../types';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/helpers';
import { useTaskContext } from './TaskContext';

type TimerState = 'idle' | 'work' | 'shortBreak' | 'longBreak';

interface PomodoroContextType {
  settings: PomodoroSettings;
  updateSettings: (newSettings: PomodoroSettings) => void;
  timerState: TimerState;
  timeRemaining: number;
  sessionsCompleted: number;
  isActive: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;
}

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { stats, setStats } = useTaskContext();
  const [settings, setSettings] = useState<PomodoroSettings>(() => 
    getFromLocalStorage('pomodoro-settings', defaultSettings)
  );
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timeRemaining, setTimeRemaining] = useState(settings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = getFromLocalStorage('pomodoro-settings', defaultSettings);
    setSettings(savedSettings);
    
    // Initialize timer based on settings
    if (timerState === 'idle' || timerState === 'work') {
      setTimeRemaining(savedSettings.workDuration * 60);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    saveToLocalStorage('pomodoro-settings', settings);
  }, [settings]);

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      // Timer completed
      completeCurrentSession();
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const completeCurrentSession = useCallback(() => {
    // Play notification sound
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.play();

    if (timerState === 'work') {
      // Completed a work session
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      // Update stats
      const newStats = {
        ...stats,
        pomodorosCompleted: stats.pomodorosCompleted + 1,
        totalFocusTime: stats.totalFocusTime + settings.workDuration,
      };
      setStats(newStats);
      saveToLocalStorage('app-stats', newStats);

      // Determine if it should be a short or long break
      if (newSessionsCompleted % settings.sessionsBeforeLongBreak === 0) {
        setTimerState('longBreak');
        setTimeRemaining(settings.longBreakDuration * 60);
      } else {
        setTimerState('shortBreak');
        setTimeRemaining(settings.shortBreakDuration * 60);
      }
    } else {
      // Completed a break, start a new work session
      setTimerState('work');
      setTimeRemaining(settings.workDuration * 60);
    }
  }, [timerState, sessionsCompleted, settings, stats]);

  const startTimer = useCallback(() => {
    if (timerState === 'idle') {
      setTimerState('work');
    }
    setIsActive(true);
  }, [timerState]);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (timerState === 'work' || timerState === 'idle') {
      setTimeRemaining(settings.workDuration * 60);
    } else if (timerState === 'shortBreak') {
      setTimeRemaining(settings.shortBreakDuration * 60);
    } else if (timerState === 'longBreak') {
      setTimeRemaining(settings.longBreakDuration * 60);
    }
  }, [timerState, settings]);

  const skipTimer = useCallback(() => {
    setIsActive(false);
    completeCurrentSession();
  }, [completeCurrentSession]);

  const updateSettings = useCallback((newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    
    // Update current timer if needed
    if (timerState === 'work' || timerState === 'idle') {
      setTimeRemaining(newSettings.workDuration * 60);
    } else if (timerState === 'shortBreak') {
      setTimeRemaining(newSettings.shortBreakDuration * 60);
    } else if (timerState === 'longBreak') {
      setTimeRemaining(newSettings.longBreakDuration * 60);
    }
  }, [timerState]);

  const value = {
    settings,
    updateSettings,
    timerState,
    timeRemaining,
    sessionsCompleted,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
};

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoroContext must be used within a PomodoroProvider');
  }
  return context;
};