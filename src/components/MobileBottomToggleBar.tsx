/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Mobile Bottom Persistent Quick Toggle Bar (Active on Every Screen on Phone)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React from 'react';
import { 
  Grid, 
  QrCode, 
  ClipboardList, 
  BatteryCharging, 
  SidebarOpen, 
  AppWindow,
  Sliders,
  Sparkles
} from 'lucide-react';
import { MainNavView } from './Header';

interface MobileBottomToggleBarProps {
  currentView: MainNavView;
  onViewChange: (view: MainNavView) => void;
  isFloatingOpen: boolean;
  onToggleFloating: () => void;
  isEdgeOpen: boolean;
  onToggleEdge: () => void;
}

export const MobileBottomToggleBar: React.FC<MobileBottomToggleBarProps> = ({
  currentView,
  onViewChange,
  isFloatingOpen,
  onToggleFloating,
  isEdgeOpen,
  onToggleEdge,
}) => {
  return (
    <aside 
      aria-label="Mobile QuickPanel Toggles" 
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 shadow-2xl px-2 py-1.5 safe-area-pb"
    >
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        
        {/* Toggle 1: Master Dashboard */}
        <button
          onClick={() => {
            onViewChange('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 rounded-xl text-[10px] font-semibold transition-all ${
            currentView === 'dashboard'
              ? 'bg-zinc-800 text-zinc-100 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Tools Dashboard"
          aria-label="Go to Dashboard"
        >
          <Grid className="w-4 h-4 mb-0.5" />
          <span>Tools</span>
        </button>

        {/* Toggle 2: QR Generator */}
        <button
          onClick={() => {
            onViewChange('qrgenerator');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] h-12 rounded-xl text-[10px] font-semibold transition-all ${
            currentView === 'qrgenerator'
              ? 'bg-zinc-800 text-zinc-100 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="QR Generator Tool"
          aria-label="Open QR Generator"
        >
          <QrCode className="w-4 h-4 mb-0.5" />
          <span>QR Gen</span>
        </button>

        {/* Toggle 3: Smart Clipboard */}
        <button
          onClick={() => {
            onViewChange('clipboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 rounded-xl text-[10px] font-semibold transition-all ${
            currentView === 'clipboard'
              ? 'bg-zinc-800 text-zinc-100 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Smart Clipboard"
          aria-label="Open Clipboard"
        >
          <ClipboardList className="w-4 h-4 mb-0.5" />
          <span>Clips</span>
        </button>

        {/* Toggle 4: Battery Health */}
        <button
          onClick={() => {
            onViewChange('battery');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 rounded-xl text-[10px] font-semibold transition-all ${
            currentView === 'battery'
              ? 'bg-zinc-800 text-zinc-100 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Battery Health Telemetry"
          aria-label="Open Battery Diagnostics"
        >
          <BatteryCharging className="w-4 h-4 mb-0.5" />
          <span>Power</span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-zinc-800 shrink-0" aria-hidden="true" />

        {/* Toggle 5: Floating Button (On/Off) */}
        <button
          onClick={onToggleFloating}
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 rounded-xl text-[10px] font-semibold transition-all relative ${
            isFloatingOpen
              ? 'text-zinc-200'
              : 'text-zinc-500 opacity-60'
          }`}
          title={isFloatingOpen ? 'Hide Floating Button' : 'Show Floating Button'}
          aria-label="Toggle Floating Quick Button"
        >
          <div className="relative">
            <AppWindow className="w-4 h-4 mb-0.5" />
            <span 
              className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                isFloatingOpen ? 'bg-emerald-400' : 'bg-zinc-600'
              }`} 
            />
          </div>
          <span>Float</span>
        </button>

        {/* Toggle 6: Edge Panel Drawer */}
        <button
          onClick={onToggleEdge}
          className={`flex flex-col items-center justify-center min-w-[52px] h-12 rounded-xl text-[10px] font-semibold transition-all ${
            isEdgeOpen
              ? 'bg-zinc-800 text-zinc-100 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
          title="Toggle Edge Panel Drawer"
          aria-label="Toggle Edge Panel"
        >
          <SidebarOpen className="w-4 h-4 mb-0.5" />
          <span>Edge</span>
        </button>

      </div>
    </aside>
  );
};
