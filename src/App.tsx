/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Master Application Root (Industrial Black & Grey Monochrome)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ClipboardEntry, 
  Collection, 
  ClipboardSettings, 
  ContentType, 
  SortOption 
} from './types/clipboard';
import { 
  ToolDefinition, 
  ToolId, 
  QuickPanelCustomization, 
  PermissionStatus, 
  PermissionId 
} from './types/quickpanel';
import { roomDb } from './db/roomDatabase';
import { androidClipboard } from './utils/clipboardManager';
import { quickPanelStorage } from './db/quickpanelStorage';

// Top Navigation & Components
import { Header, MainNavView } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ClipboardCard } from './components/ClipboardCard';
import { ClipboardPreviewModal } from './components/ClipboardPreviewModal';
import { NewClipModal } from './components/NewClipModal';
import { EditClipModal } from './components/EditClipModal';
import { FloatingQuickPanelButton } from './components/FloatingQuickPanelButton';
import { EdgePanelDrawer } from './components/EdgePanelDrawer';
import { RoomInspector } from './components/RoomInspector';
import { TestSimulationSuite } from './components/TestSimulationSuite';
import { AndroidPrivacyChip } from './components/AndroidPrivacyChip';
import { CustomizationModal } from './components/CustomizationModal';
import { PermissionsManagerModal } from './components/PermissionsManagerModal';
import { AndroidSourceModal } from './components/AndroidSourceModal';
import { MobileBottomToggleBar } from './components/MobileBottomToggleBar';

// Dedicated Tool Components
import { BatteryHealthTool } from './components/tools/BatteryHealthTool';
import { QrGeneratorTool } from './components/tools/QrGeneratorTool';
import { HomeScreenSimulator } from './components/HomeScreenSimulator';
import { CalculatorTool } from './components/tools/CalculatorTool';
import { StopwatchTool } from './components/tools/StopwatchTool';
import { FlashlightTool } from './components/tools/FlashlightTool';
import { VolumeBrightnessTool } from './components/tools/VolumeBrightnessTool';
import { ScreenshotTool } from './components/tools/ScreenshotTool';
import { ScreenRecorderTool } from './components/tools/ScreenRecorderTool';
import { QuickNotesTool } from './components/tools/QuickNotesTool';
import { QrScannerTool } from './components/tools/QrScannerTool';
import { AppShortcutsTool } from './components/tools/AppShortcutsTool';

// Icons
import { 
  Search, 
  Pin, 
  Heart, 
  ArrowUpDown, 
  CheckSquare, 
  Square, 
  Trash2, 
  FolderInput, 
  X,
  ClipboardList,
  Sparkles,
  Link,
  Mail,
  Phone,
  Code2,
  FileText,
  Sliders,
  ChevronLeft
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<MainNavView>('dashboard');

  // Persistence State
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [clipboardSettings, setClipboardSettings] = useState<ClipboardSettings>(() => roomDb.getSettings());
  const [tools, setTools] = useState<ToolDefinition[]>(() => quickPanelStorage.getTools());
  const [customization, setCustomization] = useState<QuickPanelCustomization>(() => quickPanelStorage.getCustomization());
  const [permissions, setPermissions] = useState<PermissionStatus[]>(() => quickPanelStorage.getPermissions());

  // Search & Filtering (for Clipboard view)
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [collectionFilter, setCollectionFilter] = useState<string | 'all'>('all');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Multi-Select Mode (for Clipboard)
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals & Drawers State
  const [qrSeedText, setQrSeedText] = useState<string>('');
  const [previewEntry, setPreviewEntry] = useState<ClipboardEntry | null>(null);
  const [editEntry, setEditEntry] = useState<ClipboardEntry | null>(null);
  const [isNewClipOpen, setIsNewClipOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isAndroidSourceOpen, setIsAndroidSourceOpen] = useState(false);
  const [isEdgeOpen, setIsEdgeOpen] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(true);

  // Reload clipboard entries from Room DB
  const reloadFromDb = useCallback(() => {
    setEntries(roomDb.getAllEntries());
    setCollections(roomDb.getAllCollections());
    setClipboardSettings(roomDb.getSettings());
    setTools(quickPanelStorage.getTools());
    setCustomization(quickPanelStorage.getCustomization());
    setPermissions(quickPanelStorage.getPermissions());
  }, []);

  useEffect(() => {
    reloadFromDb();
  }, [reloadFromDb]);

  // Sync theme
  useEffect(() => {
    if (customization.theme === 'dark' || (customization.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [customization.theme]);

  // Foreground clipboard sync
  useEffect(() => {
    androidClipboard.setAutoCapture(clipboardSettings.autoCapture);

    const unsubscribe = androidClipboard.subscribe((event) => {
      try {
        const result = roomDb.insertEntry(event.content);
        if (result.wasSensitiveBlocked) {
          androidClipboard.notifyPrivacyToast(
            'Sensitive content blocked by FR SHAH privacy guard',
            undefined,
            'warning'
          );
        } else {
          reloadFromDb();
        }
      } catch (e) {
        console.error('Failed to auto-insert clipboard item:', e);
      }
    });

    return unsubscribe;
  }, [clipboardSettings.autoCapture, reloadFromDb]);

  // Copy clip
  const handleCopyClip = useCallback(async (entry: ClipboardEntry) => {
    await androidClipboard.copyToClipboard(entry.content, entry.contentType.toUpperCase());
    roomDb.incrementCopyCount(entry.id);
    reloadFromDb();
  }, [reloadFromDb]);

  // Clipboard Actions
  const handleTogglePin = (id: string) => {
    roomDb.togglePin(id);
    reloadFromDb();
  };

  const handleToggleFavorite = (id: string) => {
    roomDb.toggleFavorite(id);
    reloadFromDb();
  };

  const handleDeleteEntry = (id: string) => {
    roomDb.deleteEntry(id);
    if (selectedIds.has(id)) {
      const next = new Set(selectedIds);
      next.delete(id);
      setSelectedIds(next);
    }
    reloadFromDb();
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (filteredList: ClipboardEntry[]) => {
    if (selectedIds.size === filteredList.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredList.map((e) => e.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    roomDb.deleteMultiple(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsMultiSelect(false);
    reloadFromDb();
  };

  const handleBulkMove = (colId: string | null) => {
    if (selectedIds.size === 0) return;
    roomDb.assignMultipleToCollection(Array.from(selectedIds), colId);
    setSelectedIds(new Set());
    setIsMultiSelect(false);
    reloadFromDb();
  };

  const handleShareClip = async (entry: ClipboardEntry) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FR SHAH QuickPanel Clip',
          text: entry.content,
        });
      } catch {}
    } else {
      await handleCopyClip(entry);
    }
  };

  const handleSaveNewClip = (
    content: string,
    options?: { collectionId?: string | null; tags?: string[]; isPinned?: boolean; forceSaveSensitive?: boolean }
  ) => {
    const res = roomDb.insertEntry(content, options);
    if (res.wasSensitiveBlocked) {
      androidClipboard.notifyPrivacyToast(
        'Blocked sensitive item based on privacy settings',
        undefined,
        'warning'
      );
    } else {
      androidClipboard.notifyPrivacyToast('Saved to FR SHAH History', content.slice(0, 36), 'capture');
    }
    reloadFromDb();
  };

  // Customization & Permissions updates
  const handleSaveCustomization = (newCust: QuickPanelCustomization) => {
    quickPanelStorage.saveCustomization(newCust);
    setCustomization(newCust);
  };

  const handleToggleTool = (id: ToolId, enabled: boolean) => {
    quickPanelStorage.setToolEnabled(id, enabled);
    setTools(quickPanelStorage.getTools());
  };

  const handleReorderTools = (orderIds: ToolId[]) => {
    quickPanelStorage.reorderTools(orderIds);
    setTools(quickPanelStorage.getTools());
  };

  const handleResetDefaults = () => {
    const def = quickPanelStorage.resetCustomizationToDefault();
    setCustomization(def);
    setTools(quickPanelStorage.getTools());
  };

  const handleTogglePermission = (id: PermissionId, granted: boolean) => {
    quickPanelStorage.setPermissionGranted(id, granted);
    setPermissions(quickPanelStorage.getPermissions());
  };

  // Filtered Clipboard list
  const filteredEntries = useMemo(() => {
    let list = [...entries];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((e) => {
        return (
          e.content.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q)) ||
          e.metadata?.urlDomain?.toLowerCase().includes(q) ||
          e.contentType.toLowerCase().includes(q)
        );
      });
    }

    if (typeFilter !== 'all') {
      list = list.filter((e) => e.contentType === typeFilter);
    }

    if (collectionFilter !== 'all') {
      list = list.filter((e) => e.collectionId === collectionFilter);
    }

    if (onlyPinned) {
      list = list.filter((e) => e.isPinned);
    }

    if (onlyFavorites) {
      list = list.filter((e) => e.isFavorite);
    }

    list.sort((a, b) => {
      if (sortBy === 'newest') {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt - a.createdAt;
      }
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'alphabetical') return a.content.localeCompare(b.content);
      if (sortBy === 'most_copied') return b.copyCount - a.copyCount;
      return 0;
    });

    return list;
  }, [entries, searchQuery, typeFilter, collectionFilter, onlyPinned, onlyFavorites, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans transition-colors duration-200 selection:bg-zinc-700 selection:text-white">
      {/* Top Bar Navigation */}
      <Header
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNewClip={() => setIsNewClipOpen(true)}
        onOpenCustomization={() => setIsCustomizationOpen(true)}
        onOpenPermissions={() => setIsPermissionsOpen(true)}
        onOpenAndroidSource={() => setIsAndroidSourceOpen(true)}
        onToggleEdgePanel={() => setIsEdgeOpen(!isEdgeOpen)}
        onToggleFloatingPanel={() => {
          const next = !isFloatingOpen;
          setIsFloatingOpen(next);
          handleSaveCustomization({
            ...customization,
            floatingConfig: { ...customization.floatingConfig, enabled: next },
          });
        }}
        theme={customization.theme === 'light' ? 'light' : 'dark'}
        onToggleTheme={() => {
          const next = customization.theme === 'dark' ? 'light' : 'dark';
          handleSaveCustomization({ ...customization, theme: next });
        }}
        isEdgeOpen={isEdgeOpen}
        isFloatingOpen={isFloatingOpen}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-6">
        
        {/* Navigation Breadcrumb when viewing an individual tool */}
        {currentView !== 'dashboard' && (
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors p-1 -ml-1 rounded-lg hover:bg-zinc-900"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <span className="text-[11px] font-mono text-zinc-500 uppercase">
              FR SHAH QuickPanel · {currentView.replace('_', ' ')}
            </span>
          </div>
        )}

        {/* 1. MASTER DASHBOARD VIEW */}
        {currentView === 'dashboard' && (
          <DashboardView
            tools={tools}
            customization={customization}
            onSelectTool={(v) => setCurrentView(v)}
            onOpenCustomization={() => setIsCustomizationOpen(true)}
            onOpenPermissions={() => setIsPermissionsOpen(true)}
          />
        )}

        {/* 2. SMART CLIPBOARD MANAGER VIEW */}
        {currentView === 'clipboard' && (
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clipboard history by text, URL domain, or #tag..."
                    className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300">
                    <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="newest" className="bg-zinc-900">Newest First</option>
                      <option value="oldest" className="bg-zinc-900">Oldest First</option>
                      <option value="most_copied" className="bg-zinc-900">Most Copied</option>
                      <option value="alphabetical" className="bg-zinc-900">Alphabetical (A-Z)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setIsMultiSelect(!isMultiSelect);
                      setSelectedIds(new Set());
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isMultiSelect
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                        : 'border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Select</span>
                  </button>
                </div>
              </div>

              {/* Category Segmented Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800">
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      typeFilter === 'all'
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTypeFilter('url')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'url'
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Links</span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('code')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'code'
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('email')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'email'
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Emails</span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('phone')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'phone'
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone</span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('plain_text')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'plain_text'
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Plain Text</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOnlyPinned(!onlyPinned)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      onlyPinned
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Pin className={`w-3.5 h-3.5 ${onlyPinned ? 'fill-amber-400' : ''}`} />
                    <span>Pinned ({entries.filter((e) => e.isPinned).length})</span>
                  </button>

                  <button
                    onClick={() => setOnlyFavorites(!onlyFavorites)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      onlyFavorites
                        ? 'bg-rose-400/20 text-rose-300 border border-rose-400/40'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-400' : ''}`} />
                    <span>Favorites ({entries.filter((e) => e.isFavorite).length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Multi-Select Floating Bar */}
            {isMultiSelect && (
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-700 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSelectAll(filteredEntries)}
                    className="text-xs font-semibold text-zinc-200 hover:underline flex items-center gap-1.5"
                  >
                    {selectedIds.size === filteredEntries.length ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    <span>
                      {selectedIds.size === filteredEntries.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </button>
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {selectedIds.size} of {filteredEntries.length} selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedIds.size === 0}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected</span>
                  </button>
                </div>
              </div>
            )}

            {/* Cards Grid */}
            {filteredEntries.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 p-8 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-200">
                  {searchQuery ? 'No matching clips found' : 'Clipboard history is empty'}
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Copy text in any application or create new entries using the New Clip button.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredEntries.map((entry) => {
                  const col = collections.find((c) => c.id === entry.collectionId);
                  return (
                    <ClipboardCard
                      key={entry.id}
                      entry={entry}
                      collection={col}
                      collections={collections}
                      appearance={clipboardSettings.cardAppearance}
                      isSelected={selectedIds.has(entry.id)}
                      isMultiSelectMode={isMultiSelect}
                      onToggleSelect={handleToggleSelect}
                      onCopy={handleCopyClip}
                      onTogglePin={handleTogglePin}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDeleteEntry}
                      onPreview={(e) => setPreviewEntry(e)}
                      onEdit={(e) => setEditEntry(e)}
                      onMoveToCollection={(id, colId) => {
                        roomDb.updateEntry(id, { collectionId: colId });
                        reloadFromDb();
                      }}
                      onShare={handleShareClip}
                      onConvertToQr={(text) => {
                        setQrSeedText(text);
                        setCurrentView('qrgenerator');
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2.5 BATTERY HEALTH & POWER VIEW */}
        {currentView === 'battery' && <BatteryHealthTool />}

        {/* 2.6 HOMESCREEN SIMULATION OVERLAY VIEW */}
        {currentView === 'homescreen' && (
          <HomeScreenSimulator
            onOpenQuickPanel={() => setCurrentView('dashboard')}
            onLaunchTool={(toolId) => setCurrentView(toolId as MainNavView)}
            floatingEnabled={customization.floatingConfig.enabled && isFloatingOpen}
            onToggleFloating={() => {
              const next = !(customization.floatingConfig.enabled && isFloatingOpen);
              setIsFloatingOpen(next);
              handleSaveCustomization({
                ...customization,
                floatingConfig: { ...customization.floatingConfig, enabled: next },
              });
            }}
          />
        )}

        {/* 3. SCREENSHOT TOOLS VIEW */}
        {currentView === 'screenshot' && <ScreenshotTool />}

        {/* 4. SCREEN RECORDER VIEW */}
        {currentView === 'recorder' && <ScreenRecorderTool />}

        {/* 5. FLASHLIGHT VIEW */}
        {currentView === 'flashlight' && <FlashlightTool />}

        {/* 6. VOLUME & BRIGHTNESS VIEW */}
        {currentView === 'volume' && <VolumeBrightnessTool />}

        {/* 7. CALCULATOR VIEW */}
        {currentView === 'calculator' && <CalculatorTool />}

        {/* 8. QUICK NOTES VIEW */}
        {currentView === 'notes' && <QuickNotesTool />}

        {/* 9. STOPWATCH VIEW */}
        {currentView === 'stopwatch' && <StopwatchTool />}

        {/* 10. QR GENERATOR VIEW */}
        {currentView === 'qrgenerator' && (
          <QrGeneratorTool 
            initialText={qrSeedText}
            onBackToDashboard={() => setCurrentView('dashboard')} 
          />
        )}

        {/* 10.5. QR SCANNER VIEW */}
        {currentView === 'qrscanner' && <QrScannerTool />}

        {/* 11. APP SHORTCUTS VIEW */}
        {currentView === 'appshortcuts' && <AppShortcutsTool />}

        {/* 12. ROOM DATABASE INSPECTOR VIEW */}
        {currentView === 'room_inspector' && (
          <RoomInspector
            entries={entries}
            collections={collections}
            onRefresh={reloadFromDb}
            onWipe={(preservePinned) => {
              roomDb.wipeAll(preservePinned);
              reloadFromDb();
            }}
          />
        )}

        {/* 13. TEST SUITE VIEW */}
        {currentView === 'test_suite' && (
          <TestSimulationSuite
            settings={clipboardSettings}
            onRefreshData={reloadFromDb}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-200">FR SHAH QuickPanel</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Build. Control. Customize.</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold text-zinc-300">MADE BY FR SHAH</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
            <span>Moto G75 5G Calibrated</span>
            <span aria-hidden="true">·</span>
            <span>Android 10 - 16 Support</span>
            <span aria-hidden="true">·</span>
            <span>Room DB v2.6</span>
          </div>
        </div>
      </footer>

      {/* Draggable Floating Button (TYPE_APPLICATION_OVERLAY) */}
      <FloatingQuickPanelButton
        config={{
          ...customization.floatingConfig,
          enabled: customization.floatingConfig.enabled && isFloatingOpen,
        }}
        onUpdatePosition={(x, y) => {
          handleSaveCustomization({
            ...customization,
            floatingConfig: { ...customization.floatingConfig, positionX: x, positionY: y },
          });
        }}
        onOpenQuickPanel={() => setCurrentView('dashboard')}
        onTriggerShortcut={(toolId) => setCurrentView(toolId as MainNavView)}
      />

      {/* Multi-Tool Edge Panel Drawer */}
      <EdgePanelDrawer
        isOpen={isEdgeOpen}
        onToggle={() => setIsEdgeOpen(!isEdgeOpen)}
        config={customization.edgeConfig}
        entries={entries}
        collections={collections}
        onCopyClip={handleCopyClip}
        onOpenNewClip={() => setIsNewClipOpen(true)}
        onSelectTool={(toolId) => {
          setCurrentView(toolId as MainNavView);
          setIsEdgeOpen(false);
        }}
        onOpenFullDashboard={() => {
          setCurrentView('dashboard');
          setIsEdgeOpen(false);
        }}
      />

      {/* Modals */}
      <ClipboardPreviewModal
        entry={previewEntry}
        collection={collections.find((c) => c.id === previewEntry?.collectionId)}
        collections={collections}
        onClose={() => setPreviewEntry(null)}
        onCopy={handleCopyClip}
        onTogglePin={handleTogglePin}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteEntry}
        onEdit={(e) => setEditEntry(e)}
        onMoveToCollection={(id, colId) => {
          roomDb.updateEntry(id, { collectionId: colId });
          reloadFromDb();
        }}
        onShare={handleShareClip}
      />

      <NewClipModal
        isOpen={isNewClipOpen}
        onClose={() => setIsNewClipOpen(false)}
        collections={collections}
        onSave={handleSaveNewClip}
      />

      <EditClipModal
        entry={editEntry}
        collections={collections}
        onClose={() => setEditEntry(null)}
        onSave={(id, updates) => {
          roomDb.updateEntry(id, updates);
          reloadFromDb();
        }}
      />

      <CustomizationModal
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        customization={customization}
        tools={tools}
        onSaveCustomization={handleSaveCustomization}
        onToggleTool={handleToggleTool}
        onReorderTools={handleReorderTools}
        onResetDefaults={handleResetDefaults}
      />

      <PermissionsManagerModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
        permissions={permissions}
        onTogglePermission={handleTogglePermission}
      />

      <AndroidSourceModal
        isOpen={isAndroidSourceOpen}
        onClose={() => setIsAndroidSourceOpen(false)}
      />

      {/* Android 13+ Privacy Chip */}
      {clipboardSettings.showAndroidPrivacyChip && <AndroidPrivacyChip />}

      {/* Mobile Persistent Bottom Quick Toggle Bar (Active on Every Screen on Phone) */}
      <MobileBottomToggleBar
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isFloatingOpen={isFloatingOpen}
        onToggleFloating={() => {
          const next = !isFloatingOpen;
          setIsFloatingOpen(next);
          handleSaveCustomization({
            ...customization,
            floatingConfig: { ...customization.floatingConfig, enabled: next },
          });
        }}
        isEdgeOpen={isEdgeOpen}
        onToggleEdge={() => setIsEdgeOpen(!isEdgeOpen)}
      />
    </div>
  );
}
