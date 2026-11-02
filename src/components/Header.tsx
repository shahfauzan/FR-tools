/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Top Navigation Bar (Compliant with Top Bar Contract)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React from 'react';
import { 
  Plus, 
  Settings, 
  Sun, 
  Moon, 
  SidebarOpen,
  AppWindow,
  Database
} from 'lucide-react';

interface HeaderProps {
  currentView: 'history' | 'collections' | 'inspector' | 'test_suite';
  onViewChange: (view: 'history' | 'collections' | 'inspector' | 'test_suite') => void;
  onOpenNewClip: () => void;
  onOpenSettings: () => void;
  onToggleEdgePanel: () => void;
  onToggleFloatingPanel: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isEdgeOpen: boolean;
  isFloatingOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenNewClip,
  onOpenSettings,
  onToggleEdgePanel,
  onToggleFloatingPanel,
  theme,
  onToggleTheme,
  isEdgeOpen,
  isFloatingOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#history"
            onClick={(e) => {
              e.preventDefault();
              onViewChange('history');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-sm text-sm font-black">
              FR
            </span>
            <span>FR SHAH QuickPanel</span>
          </a>
        </div>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onViewChange('history')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'history' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            History & Clips
          </button>

          <button
            onClick={() => onViewChange('collections')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'collections' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Collections
          </button>

          <button
            onClick={onToggleEdgePanel}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-slate-900 dark:hover:text-white ${
              isEdgeOpen ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <SidebarOpen className="w-4 h-4" />
            <span>Edge Panel</span>
          </button>

          <button
            onClick={onToggleFloatingPanel}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-slate-900 dark:hover:text-white ${
              isFloatingOpen ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <AppWindow className="w-4 h-4" />
            <span>Floating Panel</span>
          </button>

          <button
            onClick={() => onViewChange('inspector')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'inspector' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Room DB</span>
          </button>

          <button
            onClick={() => onViewChange('test_suite')}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 dark:hover:text-white ${
              currentView === 'test_suite' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''
            }`}
          >
            Verification Suite
          </button>
        </nav>

        {/* Zone 3: Primary Action & Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Clipboard & Room DB Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNewClip}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Clip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
