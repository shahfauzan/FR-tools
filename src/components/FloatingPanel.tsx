/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Android Freeform / Floating QuickPanel Widget
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { ClipboardEntry, Collection } from '../types/clipboard';
import { 
  X, 
  Minus, 
  Plus, 
  Copy, 
  Check, 
  Move, 
  Search, 
  Pin, 
  Maximize2 
} from 'lucide-react';

interface FloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  entries: ClipboardEntry[];
  collections: Collection[];
  onCopy: (entry: ClipboardEntry) => void;
  onOpenNewClip: () => void;
  onOpenFullDashboard: () => void;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  isOpen,
  onClose,
  entries,
  collections,
  onCopy,
  onOpenNewClip,
  onOpenFullDashboard,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (entry: ClipboardEntry) => {
    onCopy(entry);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filtered = entries.filter((e) => {
    if (!search.trim()) return true;
    return e.content.toLowerCase().includes(search.toLowerCase());
  }).slice(0, 10);

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-16 z-50 animate-in fade-in zoom-in-90">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition-all cursor-pointer border border-indigo-400/30"
          title="Restore Floating QuickPanel"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold">FR SHAH Clips ({entries.length})</span>
          <Maximize2 className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-12 right-12 z-50 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-200">
      {/* Floating Window Title Bar with Drag Cue */}
      <div className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-move select-none">
        <div className="flex items-center gap-2">
          <Move className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            FR SHAH Floating Panel
          </span>
          <span className="text-[10px] text-indigo-500 font-mono">v2.6</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Search & Add */}
      <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Quick search clips..."
            className="w-full pl-7 pr-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={onOpenNewClip}
          className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shrink-0"
          title="New Clip"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mini Clips List */}
      <div className="max-h-64 overflow-y-auto p-2 space-y-1.5">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No clips found
          </div>
        ) : (
          filtered.map((entry) => {
            const isCopied = copiedId === entry.id;
            return (
              <div
                key={entry.id}
                onClick={() => handleCopy(entry)}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isCopied
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                    {entry.isPinned && <Pin className="w-2.5 h-2.5 text-amber-500 fill-amber-500 shrink-0" />}
                    <span className="uppercase font-semibold">{entry.contentType}</span>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-200 truncate font-mono">
                    {entry.content}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(entry);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                  title="Copy"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Toolbar */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
        <button
          onClick={onOpenFullDashboard}
          className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Full Dashboard</span>
        </button>
        <span className="text-slate-400 font-medium">Click card to copy</span>
      </div>
    </div>
  );
};
