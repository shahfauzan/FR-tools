/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Customization Engine & Layout Preferences
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  RotateCcw, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Grid3X3, 
  AppWindow, 
  SidebarOpen,
  Sparkles,
  Save
} from 'lucide-react';
import { 
  QuickPanelCustomization, 
  ToolDefinition, 
  ToolId, 
  AccentTone 
} from '../types/quickpanel';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: QuickPanelCustomization;
  tools: ToolDefinition[];
  onSaveCustomization: (settings: QuickPanelCustomization) => void;
  onToggleTool: (id: ToolId, enabled: boolean) => void;
  onReorderTools: (toolIds: ToolId[]) => void;
  onResetDefaults: () => void;
}

const ACCENT_TONES: { id: AccentTone; label: string; preview: string }[] = [
  { id: 'obsidian', label: 'Obsidian Black', preview: '#09090b' },
  { id: 'carbon', label: 'Matte Carbon', preview: '#18181b' },
  { id: 'graphite', label: 'Graphite Grey', preview: '#27272a' },
  { id: 'titanium', label: 'Brushed Titanium', preview: '#3f3f46' },
  { id: 'silver', label: 'Cool Silver', preview: '#71717a' },
];

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  customization,
  tools,
  onSaveCustomization,
  onToggleTool,
  onReorderTools,
  onResetDefaults,
}) => {
  const [localSettings, setLocalSettings] = useState<QuickPanelCustomization>(customization);
  const [activeTab, setActiveTab] = useState<'layout' | 'tools' | 'panels'>('layout');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCustomization(localSettings);
    onClose();
  };

  const moveTool = (index: number, direction: 'up' | 'down') => {
    const newTools = [...tools];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTools.length) return;

    const temp = newTools[index];
    newTools[index] = newTools[targetIndex];
    newTools[targetIndex] = temp;

    onReorderTools(newTools.map((t) => t.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                QuickPanel Customization
              </h2>
              <p className="text-xs text-zinc-400">
                Build. Control. Customize. · Black & Grey Industrial Design
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-zinc-800 bg-zinc-950/40 text-xs">
          <button
            onClick={() => setActiveTab('layout')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'layout'
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Layout & Monochrome Palette
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'tools'
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Tool Arrangement & Toggles
          </button>
          <button
            onClick={() => setActiveTab('panels')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'panels'
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Floating & Edge Panel Physics
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {activeTab === 'layout' && (
            <div className="space-y-6">
              {/* Theme Selector */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                  Theme Engine (Human-Made Black & Grey)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['dark', 'light', 'system'] as const).map((th) => (
                    <button
                      key={th}
                      type="button"
                      onClick={() => setLocalSettings({ ...localSettings, theme: th })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                        localSettings.theme === th
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm'
                          : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {th} Mode
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Tone Palette */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                  Monochrome Accent Palette (Zero Purple)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ACCENT_TONES.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setLocalSettings({ ...localSettings, accentTone: tone.id })}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        localSettings.accentTone === tone.id
                          ? 'border-zinc-300 bg-zinc-800/80 text-zinc-100'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-zinc-600 shadow-xs"
                          style={{ backgroundColor: tone.preview }}
                        />
                        <span className="font-semibold">{tone.label}</span>
                      </div>
                      {localSettings.accentTone === tone.id && (
                        <Check className="w-4 h-4 text-zinc-100" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dashboard Grid Columns */}
              <div>
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                  Dashboard Tool Grid Columns
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([2, 3, 4] as const).map((cols) => (
                    <button
                      key={cols}
                      type="button"
                      onClick={() => setLocalSettings({ ...localSettings, dashboardColumns: cols })}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        localSettings.dashboardColumns === cols
                          ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm'
                          : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {cols} Columns
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-4">
              <div className="text-zinc-400">
                Enable or disable tools, and reorder cards on the main QuickPanel dashboard.
              </div>

              <div className="space-y-2">
                {tools.map((tool, index) => (
                  <div
                    key={tool.id}
                    className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-zinc-600 w-5 text-center font-bold">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-200 truncate">
                          {tool.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate">
                          {tool.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveTool(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveTool(index, 'down')}
                        disabled={index === tools.length - 1}
                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="checkbox"
                        checked={tool.enabled}
                        onChange={(e) => onToggleTool(tool.id, e.target.checked)}
                        className="w-4 h-4 rounded text-zinc-100 focus:ring-zinc-400 cursor-pointer ml-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'panels' && (
            <div className="space-y-6">
              {/* Floating QuickPanel Settings */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-zinc-200 text-sm">
                    Floating QuickPanel Button
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.floatingConfig.enabled}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        floatingConfig: {
                          ...localSettings.floatingConfig,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
                    Button Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['small', 'medium', 'large'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setLocalSettings({
                            ...localSettings,
                            floatingConfig: {
                              ...localSettings.floatingConfig,
                              size: s,
                            },
                          })
                        }
                        className={`py-1.5 rounded-xl border text-xs font-semibold capitalize ${
                          localSettings.floatingConfig.size === s
                            ? 'bg-zinc-800 text-zinc-100 border-zinc-600'
                            : 'border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Button Opacity</span>
                    <span className="font-mono text-zinc-200">
                      {localSettings.floatingConfig.opacity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={localSettings.floatingConfig.opacity}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        floatingConfig: {
                          ...localSettings.floatingConfig,
                          opacity: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-zinc-100 cursor-pointer"
                  />
                </div>
              </div>

              {/* Edge Panel Settings */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-zinc-200 text-sm">
                    Edge Panel Drawer
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.edgeConfig.enabled}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        edgeConfig: {
                          ...localSettings.edgeConfig,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
                    Handle Screen Edge
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['right', 'left'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() =>
                          setLocalSettings({
                            ...localSettings,
                            edgeConfig: {
                              ...localSettings.edgeConfig,
                              position: pos,
                            },
                          })
                        }
                        className={`py-1.5 rounded-xl border text-xs font-semibold uppercase ${
                          localSettings.edgeConfig.position === pos
                            ? 'bg-zinc-800 text-zinc-100 border-zinc-600'
                            : 'border-zinc-800 text-zinc-500'
                        }`}
                      >
                        {pos} Edge
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                    <span>Edge Panel Width</span>
                    <span className="font-mono text-zinc-200">
                      {localSettings.edgeConfig.width} px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="280"
                    max="420"
                    value={localSettings.edgeConfig.width}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        edgeConfig: {
                          ...localSettings.edgeConfig,
                          width: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-zinc-100 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/60">
          <button
            onClick={onResetDefaults}
            className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Apply Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
