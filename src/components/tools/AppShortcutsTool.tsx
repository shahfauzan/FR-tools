/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * App Shortcuts Launcher & Package Visibility Manager
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Search, 
  Star, 
  ExternalLink, 
  Phone, 
  MessageSquare, 
  Camera, 
  Globe, 
  Settings, 
  Image, 
  Folder, 
  Clock, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { AppShortcutItem } from '../../types/quickpanel';
import { quickPanelStorage } from '../../db/quickpanelStorage';

export const AppShortcutsTool: React.FC = () => {
  const [apps, setApps] = useState<AppShortcutItem[]>([]);
  const [search, setSearch] = useState('');
  const [launchedNotice, setLaunchedNotice] = useState<string | null>(null);

  useEffect(() => {
    setApps(quickPanelStorage.getApps());
  }, []);

  const handleToggleFavorite = (id: string) => {
    quickPanelStorage.toggleAppFavorite(id);
    setApps(quickPanelStorage.getApps());
  };

  const handleLaunch = (app: AppShortcutItem) => {
    setLaunchedNotice(`Simulated Intent: Intent.ACTION_MAIN -> ${app.packageName}`);
    setTimeout(() => setLaunchedNotice(null), 3000);
  };

  const getAppIcon = (name: string) => {
    switch (name) {
      case 'Phone':
        return <Phone className="w-5 h-5 text-zinc-200" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-zinc-200" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-zinc-200" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-zinc-200" />;
      case 'Settings':
        return <Settings className="w-5 h-5 text-zinc-200" />;
      case 'Image':
        return <Image className="w-5 h-5 text-zinc-200" />;
      case 'Folder':
        return <Folder className="w-5 h-5 text-zinc-200" />;
      default:
        return <Clock className="w-5 h-5 text-zinc-200" />;
    }
  };

  const filteredApps = apps.filter((a) => {
    if (!search.trim()) return true;
    return (
      a.label.toLowerCase().includes(search.toLowerCase()) ||
      a.packageName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Launcher Integration
            </span>
            <span className="text-xs text-zinc-600">·</span>
            <span className="text-xs text-zinc-400 font-mono">PackageManager API</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mt-0.5">
            App Shortcuts & Quick Launch
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Fast application launching adhering to Android 11+ package visibility declarations.
          </p>
        </div>

        <div className="text-[11px] font-mono text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
          Intent.CATEGORY_LAUNCHER
        </div>
      </div>

      {/* Simulated Intent Banner */}
      {launchedNotice && (
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 text-center animate-in fade-in">
          {launchedNotice}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search applications by name or package ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            onClick={() => handleLaunch(app)}
            className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getAppIcon(app.iconName)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-100 truncate">
                  {app.label}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono truncate">
                  {app.category}
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite(app.id);
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                app.isFavorite
                  ? 'text-zinc-100'
                  : 'text-zinc-600 hover:text-zinc-400'
              }`}
              title={app.isFavorite ? 'Remove from favorites' : 'Star favorite'}
            >
              <Star className={`w-4 h-4 ${app.isFavorite ? 'fill-zinc-100' : ''}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Package Visibility Policy Note */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-400 space-y-1">
        <div className="font-bold text-zinc-200">Android Package Visibility Architecture</div>
        <p className="text-[11px] leading-relaxed">
          FR SHAH QuickPanel declares specific `&lt;queries&gt;` in its `AndroidManifest.xml` rather than requesting the restricted `QUERY_ALL_PACKAGES` permission, guaranteeing complete Google Play Developer Policy compliance.
        </p>
      </div>
    </div>
  );
};
