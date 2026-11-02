/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * QuickPanel Status & Command Strip
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Pin, 
  HardDrive, 
  ClipboardCopy, 
  Trash2,
  SidebarOpen,
  AppWindow,
  Lock
} from 'lucide-react';
import { ClipboardSettings } from '../types/clipboard';

interface QuickPanelDashboardProps {
  totalCount: number;
  pinnedCount: number;
  favoriteCount: number;
  storageFormatted: string;
  settings: ClipboardSettings;
  onManualCaptureFromSystem: () => void;
  onTriggerCleanup: () => void;
  onToggleEdgePanel: () => void;
  onToggleFloatingPanel: () => void;
  isEdgeOpen: boolean;
  isFloatingOpen: boolean;
}

export const QuickPanelDashboard: React.FC<QuickPanelDashboardProps> = ({
  totalCount,
  pinnedCount,
  favoriteCount,
  storageFormatted,
  settings,
  onManualCaptureFromSystem,
  onTriggerCleanup,
  onToggleEdgePanel,
  onToggleFloatingPanel,
  isEdgeOpen,
  isFloatingOpen,
}) => {
  return (
    <div className="w-full bg-slate-900/40 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 mb-6 backdrop-blur-sm shadow-xs">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
              FR SHAH QuickPanel Module
            </span>
            <span className="text-xs text-slate-400" aria-hidden="true">·</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Android 10+ & 13+ Compliant
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-0.5">
            Smart Clipboard Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Persistent local Room database history with real-time classification and edge multitasking.
          </p>
        </div>

        {/* Developer Credit Tag */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Local Room DB · MADE BY FR SHAH</span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (Tabular numerals, single-elevation) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-4">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Stored Clips</span>
            <ClipboardCopy className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {totalCount} <span className="text-xs font-normal text-slate-400">/ {settings.historyCapacity}</span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Capacity auto-trims oldest
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Pinned Entries</span>
            <Pin className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {pinnedCount}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Immune to cleanup</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Favorites</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {favoriteCount}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Starred references
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Room Storage</span>
            <HardDrive className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-1 tabular-nums font-mono">
            {storageFormatted}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Indexed SQLite simulation
          </div>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2 pt-4">
        <button
          onClick={onManualCaptureFromSystem}
          className="px-3 py-1.5 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-600/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="Read foreground clipboard from device"
        >
          <ClipboardCopy className="w-3.5 h-3.5" />
          <span>Sync Device Clipboard</span>
        </button>

        <button
          onClick={onToggleEdgePanel}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isEdgeOpen
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <SidebarOpen className="w-3.5 h-3.5" />
          <span>{isEdgeOpen ? 'Close Edge Panel' : 'Open Edge Panel'}</span>
        </button>

        <button
          onClick={onToggleFloatingPanel}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isFloatingOpen
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AppWindow className="w-3.5 h-3.5" />
          <span>{isFloatingOpen ? 'Hide Floating Widget' : 'Show Floating Widget'}</span>
        </button>

        <button
          onClick={onTriggerCleanup}
          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
          title="Run automatic cleanup (clears expired non-pinned clips)"
        >
          <Trash2 className="w-3.5 h-3.5 text-amber-500" />
          <span>Run Retention Cleanup</span>
        </button>
      </div>
    </div>
  );
};
