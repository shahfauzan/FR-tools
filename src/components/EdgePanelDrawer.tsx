/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Multi-Tool Edge Panel Drawer (One UI / Android Swipe System)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Pin, 
  Search, 
  Plus, 
  Camera, 
  Flashlight, 
  Calculator, 
  Timer, 
  SlidersHorizontal,
  FileText,
  Maximize2,
  BatteryCharging,
  QrCode
} from 'lucide-react';
import { ClipboardEntry, Collection } from '../types/clipboard';
import { EdgePanelConfig, ToolId } from '../types/quickpanel';

interface EdgePanelDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  config: EdgePanelConfig;
  entries: ClipboardEntry[];
  collections: Collection[];
  onCopyClip: (entry: ClipboardEntry) => void;
  onOpenNewClip: () => void;
  onSelectTool: (toolId: ToolId) => void;
  onOpenFullDashboard: () => void;
}

export const EdgePanelDrawer: React.FC<EdgePanelDrawerProps> = ({
  isOpen,
  onToggle,
  config,
  entries,
  collections,
  onCopyClip,
  onOpenNewClip,
  onSelectTool,
  onOpenFullDashboard,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'clips' | 'tools'>('clips');

  if (!config.enabled) return null;

  const handleCopy = (entry: ClipboardEntry) => {
    onCopyClip(entry);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredEntries = entries.filter((e) => {
    if (!search.trim()) return true;
    return e.content.toLowerCase().includes(search.toLowerCase());
  }).slice(0, 15);

  const isRight = config.position === 'right';

  return (
    <>
      {/* Floating Edge Trigger Handle */}
      <button
        onClick={onToggle}
        style={{
          top: `${config.triggerOffset}%`,
          opacity: config.opacity / 100,
        }}
        className={`fixed z-40 -translate-y-1/2 flex items-center justify-center w-7 h-20 shadow-xl border-y transition-all duration-200 group cursor-pointer ${
          isRight
            ? 'right-0 rounded-l-2xl border-l border-zinc-700/80 bg-zinc-900 text-zinc-300 hover:w-9'
            : 'left-0 rounded-r-2xl border-r border-zinc-700/80 bg-zinc-900 text-zinc-300 hover:w-9'
        }`}
        title={isOpen ? 'Close Edge Panel' : 'Swipe/Tap to Open FR SHAH Edge Panel'}
        aria-label="Toggle QuickPanel Edge Panel"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="w-1 h-3 rounded-full bg-zinc-500 group-hover:bg-zinc-200" />
          <span className="w-1 h-3 rounded-full bg-zinc-500 group-hover:bg-zinc-200" />
        </div>
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Edge Drawer Container */}
      <aside
        style={{
          width: `${config.width}px`,
          opacity: config.opacity / 100,
        }}
        className={`fixed top-0 bottom-0 z-50 bg-zinc-900/98 backdrop-blur-xl border-zinc-800 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isRight ? 'right-0 border-l' : 'left-0 border-r'
        } ${
          isOpen
            ? 'translate-x-0'
            : isRight
            ? 'translate-x-full pointer-events-none'
            : '-translate-x-full pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              FR SHAH QuickPanel
            </div>
            <h3 className="text-sm font-bold text-zinc-100">
              Edge Multitasker
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenNewClip}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Add Clip"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch: Quick Tools vs Clipboard */}
        <div className="grid grid-cols-2 p-1 bg-zinc-950 border-b border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('clips')}
            className={`py-1.5 rounded-lg transition-colors ${
              activeTab === 'clips' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Clips History
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`py-1.5 rounded-lg transition-colors ${
              activeTab === 'tools' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Quick Tools
          </button>
        </div>

        {activeTab === 'clips' ? (
          <>
            {/* Search */}
            <div className="p-3 border-b border-zinc-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search edge clips..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-950 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            </div>

            {/* Clips List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredEntries.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500">
                  No clips found
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
                          ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300'
                          : 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                        <div className="flex items-center gap-1 font-mono uppercase font-semibold text-zinc-400">
                          {entry.isPinned && <Pin className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />}
                          <span>{entry.contentType}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(entry);
                          }}
                          className="p-1 rounded text-zinc-400 hover:text-white"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <p className="text-xs text-zinc-200 line-clamp-2 font-mono break-words leading-relaxed">
                        {entry.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          /* Quick Tools Grid in Edge Panel */
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Instant Launch Tools
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onToggle();
                  onSelectTool('battery');
                }}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all space-y-1.5"
              >
                <BatteryCharging className="w-5 h-5 text-zinc-200" />
                <div className="text-xs font-bold text-zinc-200">Battery Health</div>
                <div className="text-[10px] text-zinc-500">Live Power Stats</div>
              </button>

              <button
                onClick={() => {
                  onToggle();
                  onSelectTool('qrgenerator');
                }}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all space-y-1.5"
              >
                <QrCode className="w-5 h-5 text-zinc-200" />
                <div className="text-xs font-bold text-zinc-200">QR Generator</div>
                <div className="text-[10px] text-zinc-500">Clips to QR</div>
              </button>

              <button
                onClick={() => {
                  onToggle();
                  onSelectTool('flashlight');
                }}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all space-y-1.5"
              >
                <Flashlight className="w-5 h-5 text-zinc-200" />
                <div className="text-xs font-bold text-zinc-200">Flashlight</div>
                <div className="text-[10px] text-zinc-500">Camera Torch</div>
              </button>

              <button
                onClick={() => {
                  onToggle();
                  onSelectTool('screenshot');
                }}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all space-y-1.5"
              >
                <Camera className="w-5 h-5 text-zinc-200" />
                <div className="text-xs font-bold text-zinc-200">Screenshot</div>
                <div className="text-[10px] text-zinc-500">Capture View</div>
              </button>

              <button
                onClick={() => {
                  onToggle();
                  onSelectTool('calculator');
                }}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all space-y-1.5"
              >
                <Calculator className="w-5 h-5 text-zinc-200" />
                <div className="text-xs font-bold text-zinc-200">Calculator</div>
                <div className="text-[10px] text-zinc-500">Keypad</div>
              </button>

              <button
                onClick={() => {
                  onToggle();
                  onSelectTool('stopwatch');
                }}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all space-y-1.5"
              >
                <Timer className="w-5 h-5 text-zinc-200" />
                <div className="text-xs font-bold text-zinc-200">Stopwatch</div>
                <div className="text-[10px] text-zinc-500">Lap Timer</div>
              </button>

              <button
                onClick={() => {
                  onToggle();
                  onSelectTool('volume');
                }}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all space-y-1.5"
              >
                <SlidersHorizontal className="w-5 h-5 text-zinc-200" />
                <div className="text-xs font-bold text-zinc-200">Volume</div>
                <div className="text-[10px] text-zinc-500">Audio Sliders</div>
              </button>

              <button
                onClick={() => {
                  onToggle();
                  onSelectTool('notes');
                }}
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all space-y-1.5"
              >
                <FileText className="w-5 h-5 text-zinc-200" />
                <div className="text-xs font-bold text-zinc-200">Quick Notes</div>
                <div className="text-[10px] text-zinc-500">Scratchpad</div>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onToggle();
              onOpenFullDashboard();
            }}
            className="text-zinc-300 hover:text-white font-bold flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Open Dashboard</span>
          </button>
          <span className="text-[10px] text-zinc-500 font-mono">FR SHAH QuickPanel</span>
        </div>
      </aside>
    </>
  );
};
