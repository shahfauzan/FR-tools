/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Top Navigation Bar (Industrial Black & Grey Monochrome)
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
  ShieldCheck,
  FolderGit2,
  Sliders,
  BatteryCharging,
  Smartphone,
  QrCode
} from 'lucide-react';

export type MainNavView = 
  | 'dashboard' 
  | 'battery'
  | 'clipboard' 
  | 'qrgenerator'
  | 'screenshot' 
  | 'recorder' 
  | 'flashlight' 
  | 'volume' 
  | 'calculator' 
  | 'notes' 
  | 'stopwatch' 
  | 'qrscanner' 
  | 'appshortcuts' 
  | 'homescreen'
  | 'room_inspector' 
  | 'test_suite';

interface HeaderProps {
  currentView: MainNavView;
  onViewChange: (view: MainNavView) => void;
  onOpenNewClip: () => void;
  onOpenCustomization: () => void;
  onOpenPermissions: () => void;
  onOpenAndroidSource: () => void;
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
  onOpenCustomization,
  onOpenPermissions,
  onOpenAndroidSource,
  onToggleEdgePanel,
  onToggleFloatingPanel,
  theme,
  onToggleTheme,
  isEdgeOpen,
  isFloatingOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onViewChange('dashboard')}
            className="text-left flex items-center gap-2.5 group cursor-pointer"
          >
            <span className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-sm text-xs font-black tracking-tighter group-hover:scale-105 transition-transform">
              FR
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-zinc-100 whitespace-nowrap">
                FR SHAH QuickPanel
              </span>
              <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                Build. Control. Customize.
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single line, black & grey) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-zinc-400">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'dashboard' ? 'text-zinc-100 font-bold border-b border-zinc-100 pb-0.5' : ''
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => onViewChange('battery')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-white ${
              currentView === 'battery' ? 'text-zinc-100 font-bold border-b border-zinc-100 pb-0.5' : ''
            }`}
          >
            <BatteryCharging className="w-3.5 h-3.5 text-zinc-300" />
            <span>Battery Health</span>
          </button>

          <button
            onClick={() => onViewChange('homescreen')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-white ${
              currentView === 'homescreen' ? 'text-zinc-100 font-bold border-b border-zinc-100 pb-0.5' : ''
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-zinc-300" />
            <span>Homescreen Overlay</span>
          </button>

          <button
            onClick={() => onViewChange('clipboard')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'clipboard' ? 'text-zinc-100 font-bold border-b border-zinc-100 pb-0.5' : ''
            }`}
          >
            Smart Clipboard
          </button>

          <button
            onClick={() => onViewChange('qrgenerator')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-white ${
              currentView === 'qrgenerator' ? 'text-zinc-100 font-bold border-b border-zinc-100 pb-0.5' : ''
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-zinc-300" />
            <span>QR Generator</span>
          </button>

          <button
            onClick={onToggleEdgePanel}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-white ${
              isEdgeOpen ? 'text-zinc-100 font-bold' : ''
            }`}
          >
            <SidebarOpen className="w-3.5 h-3.5" />
            <span>Edge Panel</span>
          </button>

          <button
            onClick={onToggleFloatingPanel}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-white ${
              isFloatingOpen ? 'text-zinc-100 font-bold' : ''
            }`}
          >
            <AppWindow className="w-3.5 h-3.5" />
            <span>Floating Button</span>
          </button>

          <button
            onClick={onOpenPermissions}
            className="whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Permissions</span>
          </button>

          <button
            onClick={onOpenAndroidSource}
            className="whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-white font-mono text-[11px]"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Android Code & GitHub</span>
          </button>

          <button
            onClick={() => onViewChange('test_suite')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'test_suite' ? 'text-zinc-100 font-bold border-b border-zinc-100 pb-0.5' : ''
            }`}
          >
            Test Suite
          </button>
        </nav>

        {/* Zone 3: Primary Action & Tools */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-2 text-zinc-400 hover:text-zinc-100 rounded-xl hover:bg-zinc-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCustomization}
            className="p-2 text-zinc-400 hover:text-zinc-100 rounded-xl hover:bg-zinc-800 transition-colors"
            title="Customization Engine"
            aria-label="Customize"
          >
            <Sliders className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNewClip}
            className="px-3 py-1.5 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white active:scale-95 rounded-xl shadow-sm transition-all whitespace-nowrap flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Clip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
