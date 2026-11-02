/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Android / One UI Edge Panel Slide-out
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { ClipboardEntry, Collection } from '../types/clipboard';
import { 
  X, 
  Copy, 
  Check, 
  Pin, 
  Search, 
  SidebarClose, 
  SidebarOpen, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface EdgePanelProps {
  isOpen: boolean;
  onToggle: () => void;
  entries: ClipboardEntry[];
  collections: Collection[];
  onCopy: (entry: ClipboardEntry) => void;
  onOpenNewClip: () => void;
  onOpenFullDashboard: () => void;
}

export const EdgePanel: React.FC<EdgePanelProps> = ({
  isOpen,
  onToggle,
  entries,
  collections,
  onCopy,
  onOpenNewClip,
  onOpenFullDashboard,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pinned' | 'url' | 'code'>('all');

  const filteredEntries = entries.filter((e) => {
    if (filter === 'pinned' && !e.isPinned) return false;
    if (filter === 'url' && e.contentType !== 'url') return false;
    if (filter === 'code' && e.contentType !== 'code') return false;
    if (search.trim()) {
      return e.content.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handleCopy = (entry: ClipboardEntry) => {
    onCopy(entry);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <>
      {/* Floating Edge Trigger Handle (Always visible on the right edge) */}
      <button
        onClick={onToggle}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-7 h-20 rounded-l-2xl shadow-lg border-y border-l transition-all duration-300 group ${
          isOpen
            ? 'bg-indigo-600 text-white border-indigo-500 translate-x-1'
            : 'bg-slate-900/90 text-slate-300 hover:text-white hover:w-9 border-slate-700/80 backdrop-blur-md'
        }`}
        title={isOpen ? 'Close Edge Panel' : 'Open QuickPanel Edge Clipboard'}
        aria-label="Toggle QuickPanel Edge Panel"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="w-1 h-3 rounded-full bg-slate-400 group-hover:bg-white" />
          <span className="w-1 h-3 rounded-full bg-slate-400 group-hover:bg-white" />
        </div>
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Edge Drawer Container */}
      <aside
        className={`fixed top-0 right-0 h-full w-[340px] sm:w-[380px] z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {/* Edge Panel Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              <span>FR SHAH Edge Panel</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Quick Clipboard
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenNewClip}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Add Clip"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Edge Search & Filter Strip */}
        <div className="p-3 border-b border-slate-200/80 dark:border-slate-800/80 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clips..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All ({entries.length})
            </button>
            <button
              onClick={() => setFilter('pinned')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                filter === 'pinned'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              <Pin className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>Pinned</span>
            </button>
            <button
              onClick={() => setFilter('url')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === 'url'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Links
            </button>
            <button
              onClick={() => setFilter('code')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === 'code'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Code
            </button>
          </div>
        </div>

        {/* Scrollable Clips List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredEntries.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching clips found
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isCopied = copiedId === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => handleCopy(entry)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    isCopied
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600'
                      : 'bg-white dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                      {entry.isPinned && (
                        <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                      <span className="font-semibold uppercase text-slate-600 dark:text-slate-300">
                        {entry.contentType}
                      </span>
                      {entry.metadata?.urlDomain && (
                        <span className="font-mono truncate">· {entry.metadata.urlDomain}</span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(entry);
                      }}
                      className="p-1 rounded-md text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                      title="1-Tap Copy"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 font-mono break-words leading-relaxed">
                    {entry.content}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Edge Panel Bottom Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => {
              onToggle();
              onOpenFullDashboard();
            }}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Open Full Dashboard</span>
          </button>

          <span className="text-[10px] text-slate-400">
            1-Tap Quick Paste Active
          </span>
        </div>
      </aside>
    </>
  );
};
