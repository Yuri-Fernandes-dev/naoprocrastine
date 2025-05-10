import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/layout/Header';
import KanbanBoard from './components/kanban/KanbanBoard';
import PomodoroTimer from './components/pomodoro/PomodoroTimer';
import Dashboard from './components/dashboard/Dashboard';
import { TaskProvider } from './contexts/TaskContext';
import { PomodoroProvider } from './contexts/PomodoroContext';
import './i18n';

function App() {
  const [currentView, setCurrentView] = useState('kanban');

  const renderView = () => {
    switch (currentView) {
      case 'kanban':
        return <KanbanBoard />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <Router>
      <TaskProvider>
        <PomodoroProvider>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-grow">{renderView()}</main>
          </div>
        </PomodoroProvider>
      </TaskProvider>
    </Router>
  );
}

export default App;