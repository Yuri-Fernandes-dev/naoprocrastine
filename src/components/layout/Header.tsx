import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, BarChart2 } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const { i18n } = useTranslation();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Focus Flow</h1>
          </div>
          <nav className="flex items-center space-x-4">''
            <LanguageSelector />
            <button
              onClick={() => setCurrentView('kanban')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === 'kanban'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setCurrentView('pomodoro')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                currentView === 'pomodoro'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Clock size={16} className="mr-1" />
              Pomodoro
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                currentView === 'dashboard'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart2 size={16} className="mr-1" />
              Dashboard
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;