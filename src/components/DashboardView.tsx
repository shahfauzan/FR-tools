/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Master Dashboard View & Tool Grid
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { 
  ClipboardList, 
  Camera, 
  Video, 
  Flashlight, 
  SlidersHorizontal, 
  Calculator, 
  FileText, 
  Timer, 
  QrCode, 
  Grid, 
  Search, 
  Sliders, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { ToolDefinition, ToolId, QuickPanelCustomization } from '../types/quickpanel';
import { MainNavView } from './Header';

interface DashboardViewProps {
  tools: ToolDefinition[];
  customization: QuickPanelCustomization;
  onSelectTool: (view: MainNavView) => void;
  onOpenCustomization: () => void;
  onOpenPermissions: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tools,
  customization,
  onSelectTool,
  onOpenCustomization,
  onOpenPermissions,
}) => {
  const [search, setSearch] = useState('');

  const getToolIcon = (id: ToolId) => {
    switch (id) {
      case 'clipboard':
        return <ClipboardList className="w-5 h-5 text-zinc-100" />;
      case 'screenshot':
        return <Camera className="w-5 h-5 text-zinc-100" />;
      case 'recorder':
        return <Video className="w-5 h-5 text-zinc-100" />;
      case 'flashlight':
        return <Flashlight className="w-5 h-5 text-zinc-100" />;
      case 'volume':
        return <SlidersHorizontal className="w-5 h-5 text-zinc-100" />;
      case 'calculator':
        return <Calculator className="w-5 h-5 text-zinc-100" />;
      case 'notes':
        return <FileText className="w-5 h-5 text-zinc-100" />;
      case 'stopwatch':
        return <Timer className="w-5 h-5 text-zinc-100" />;
      case 'qrscanner':
        return <QrCode className="w-5 h-5 text-zinc-100" />;
      case 'appshortcuts':
        return <Grid className="w-5 h-5 text-zinc-100" />;
      default:
        return <Sparkles className="w-5 h-5 text-zinc-100" />;
    }
  };

  const enabledTools = tools
    .filter((t) => t.enabled)
    .filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });

  // Dynamic Grid column classes
  const gridColClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[customization.dashboardColumns];

  return (
    <div className="space-y-6">
      {/* Brand Hero & Quick Status */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 font-mono">
              <span>MOTO G75 5G CALIBRATED</span>
              <span className="text-zinc-600">·</span>
              <span>ANDROID 16 READY</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">MADE BY FR SHAH</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100">
              FR SHAH QuickPanel
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Build. Control. Customize. Direct device access toolbox with floating button overlay, swipe edge drawer, and local persistent Room database storage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenPermissions}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Permission Shield</span>
            </button>

            <button
              onClick={onOpenCustomization}
              className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 stroke-[2.5]" />
              <span>Customize Toolbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tool Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tools by name, utility category, or capability..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 shadow-xs"
        />
      </div>

      {/* Tools Responsive Grid */}
      <div className={`grid ${gridColClass} gap-4`}>
        {enabledTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id as MainNavView)}
            className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/80 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  {getToolIcon(tool.id)}
                </div>

                {tool.badge && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {tool.badge}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-zinc-200">
              <span className="capitalize font-mono text-[11px] text-zinc-500">
                {tool.category}
              </span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
