/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Android 16 / Moto G75 5G Homescreen Simulator
 * Validates Floating QuickPanel Button persistence and behavior over the system homescreen
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect } from 'react';
import { 
  AppWindow, 
  Wifi, 
  BatteryMedium, 
  BatteryCharging, 
  Signal, 
  Search, 
  Camera, 
  Phone, 
  Chrome, 
  MessageSquare, 
  Settings, 
  Folder, 
  Maximize2, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Clock,
  Layers,
  ChevronRight,
  QrCode,
  FileText
} from 'lucide-react';
import { ToolId } from '../types/quickpanel';

interface HomeScreenSimulatorProps {
  onOpenQuickPanel: () => void;
  onLaunchTool: (toolId: ToolId) => void;
  floatingEnabled: boolean;
  onToggleFloating: () => void;
}

export const HomeScreenSimulator: React.FC<HomeScreenSimulatorProps> = ({
  onOpenQuickPanel,
  onLaunchTool,
  floatingEnabled,
  onToggleFloating,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('10:42');
  const [currentDate, setCurrentDate] = useState<string>('Tuesday, Nov 3');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner explaining Android 16 Homescreen Overlay */}
      <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-100 flex items-center justify-center shrink-0">
            <AppWindow className="w-5 h-5 text-zinc-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-100">
                Android 16 Homescreen Overlay Mode
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                SYSTEM_ALERT_WINDOW Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              The FR SHAH Floating Button floats persistently on your Android homescreen and across every application. Drag it anywhere or tap it to open the quick launcher.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
          <button
            onClick={onToggleFloating}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              floatingEnabled 
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            <AppWindow className="w-3.5 h-3.5" />
            <span>{floatingEnabled ? 'Floating Button: ON' : 'Floating Button: OFF'}</span>
          </button>

          <button
            onClick={onOpenQuickPanel}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <span>Return to Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated Moto G75 5G Phone Frame with Live Floating Button */}
      <div className="relative mx-auto max-w-md w-full rounded-[44px] border-[6px] border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden p-1">
        {/* Screen Bezel & Dynamic Island / Camera Punch Hole */}
        <div className="relative rounded-[38px] bg-gradient-to-b from-zinc-900 via-zinc-950 to-black min-h-[640px] flex flex-col justify-between p-5 select-none border border-zinc-800/60">
          
          {/* Top Status Bar (Moto G75 5G Android 16) */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono tracking-tight pt-1 px-1">
              <span className="font-bold text-zinc-200">{currentTime}</span>

              {/* Center Punch-Hole Camera */}
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-zinc-800 shadow-inner" />

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider text-zinc-400">5G</span>
                <Signal className="w-3.5 h-3.5 text-zinc-300" />
                <Wifi className="w-3.5 h-3.5 text-zinc-300" />
                <div className="flex items-center gap-0.5 text-zinc-300 font-bold">
                  <span className="text-[11px]">78%</span>
                  <BatteryMedium className="w-3.5 h-3.5 text-zinc-300" />
                </div>
              </div>
            </div>

            {/* At-A-Glance & Clock Widget */}
            <div className="mt-8 space-y-2 text-center">
              <div className="text-6xl font-black text-zinc-100 tracking-tight font-sans">
                {currentTime}
              </div>
              <div className="text-xs font-medium text-zinc-400 flex items-center justify-center gap-2">
                <span>{currentDate}</span>
                <span aria-hidden="true">·</span>
                <span>24°C Clean Air</span>
              </div>
            </div>

            {/* Battery Health Mini-Widget on Homescreen */}
            <div 
              onClick={() => onLaunchTool('battery')}
              className="mt-6 mx-2 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-lg hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-200 flex items-center justify-center">
                    <BatteryCharging className="w-4 h-4 text-zinc-300" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-zinc-200 group-hover:text-white flex items-center gap-1.5">
                      <span>Moto G75 Power Status</span>
                      <span className="text-[9px] font-mono uppercase bg-zinc-800 text-zinc-400 px-1 rounded">Live</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      78% · 18h 45m left · 31.4°C Good
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-zinc-300">97% Cap</span>
                  <div className="text-[9px] text-zinc-500">Tap to diagnose</div>
                </div>
              </div>
            </div>

            {/* Google Search Pill Bar */}
            <div className="mt-4 mx-2 px-3.5 py-2.5 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-zinc-400 shadow-sm">
              <div className="flex items-center gap-2 text-xs">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-500 text-xs">Search or type web address</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-zinc-800 text-[10px] font-bold flex items-center justify-center text-zinc-300">
                G
              </div>
            </div>
          </div>

          {/* Homescreen App Grid */}
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              {/* App 1: QuickPanel (Primary app) */}
              <button
                onClick={onOpenQuickPanel}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border border-zinc-200 relative">
                  <span className="font-black text-sm tracking-tighter">FR</span>
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-zinc-400" />
                </div>
                <span className="text-[11px] font-medium text-zinc-200 truncate w-14">
                  QuickPanel
                </span>
              </button>

              {/* App 2: Battery Health */}
              <button
                onClick={() => onLaunchTool('battery')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-zinc-200 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <BatteryCharging className="w-5 h-5 text-zinc-300" />
                </div>
                <span className="text-[11px] font-medium text-zinc-300 truncate w-14">
                  Battery
                </span>
              </button>

              {/* App 3: Smart Clipboard */}
              <button
                onClick={() => onLaunchTool('clipboard')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-zinc-200 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5 text-zinc-300" />
                </div>
                <span className="text-[11px] font-medium text-zinc-300 truncate w-14">
                  Clipboard
                </span>
              </button>

              {/* App 4: Screenshot Studio */}
              <button
                onClick={() => onLaunchTool('screenshot')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-zinc-200 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5 text-zinc-300" />
                </div>
                <span className="text-[11px] font-medium text-zinc-300 truncate w-14">
                  Screenshots
                </span>
              </button>
            </div>

            {/* Second row of homescreen apps */}
            <div className="grid grid-cols-4 gap-4 text-center">
              {/* App 5: QR Generator */}
              <button
                onClick={() => onLaunchTool('qrgenerator')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-zinc-200 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <QrCode className="w-5 h-5 text-zinc-300" />
                </div>
                <span className="text-[11px] font-medium text-zinc-300 truncate w-14">
                  QR Gen
                </span>
              </button>

              {/* App 6: Calculator */}
              <button
                onClick={() => onLaunchTool('calculator')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-zinc-200 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="font-mono text-xs font-bold text-zinc-300">+-×÷</span>
                </div>
                <span className="text-[11px] font-medium text-zinc-300 truncate w-14">
                  Calculator
                </span>
              </button>

              {/* App 7: Notes */}
              <button
                onClick={() => onLaunchTool('notes')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-zinc-200 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 text-zinc-300" />
                </div>
                <span className="text-[11px] font-medium text-zinc-300 truncate w-14">
                  Notes
                </span>
              </button>

              {/* App 8: Torch */}
              <button
                onClick={() => onLaunchTool('flashlight')}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-zinc-200 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="text-xs font-bold text-zinc-300">⚡</span>
                </div>
                <span className="text-[11px] font-medium text-zinc-300 truncate w-14">
                  Torch
                </span>
              </button>
            </div>

            {/* Guidance Overlay Box */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-1">
              <div className="text-[11px] font-bold text-zinc-200 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                <span>Floating QuickPanel is Active</span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Notice the floating <span className="font-mono text-zinc-200">FR</span> button at the side of your screen. It can be dragged to any spot and tapped anytime to bring up quick tools!
              </p>
            </div>
          </div>

          {/* Bottom Dock & Android Navigation Bar */}
          <div className="space-y-4 pt-4 border-t border-zinc-800/60">
            {/* Dock icons */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center">
                  <Chrome className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-zinc-300" />
                </div>
              </div>
            </div>

            {/* Android 16 Gesture Pill Bar */}
            <div className="flex justify-center pb-1">
              <div className="w-28 h-1 rounded-full bg-zinc-500/80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
