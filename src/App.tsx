/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * FR SHAH QuickPanel Root Application
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
import { roomDb } from './db/roomDatabase';
import { androidClipboard } from './utils/clipboardManager';
import { Header } from './components/Header';
import { QuickPanelDashboard } from './components/QuickPanelDashboard';
import { ClipboardCard } from './components/ClipboardCard';
import { ClipboardPreviewModal } from './components/ClipboardPreviewModal';
import { NewClipModal } from './components/NewClipModal';
import { EditClipModal } from './components/EditClipModal';
import { EdgePanel } from './components/EdgePanel';
import { FloatingPanel } from './components/FloatingPanel';
import { CollectionsManager } from './components/CollectionsManager';
import { SettingsModal } from './components/SettingsModal';
import { RoomInspector } from './components/RoomInspector';
import { TestSimulationSuite } from './components/TestSimulationSuite';
import { AndroidPrivacyChip } from './components/AndroidPrivacyChip';
import { 
  Search, 
  Pin, 
  Heart, 
  ArrowUpDown, 
  CheckSquare, 
  Square, 
  Trash2, 
  FolderInput, 
  Layers, 
  X,
  ClipboardList,
  Sparkles,
  Link,
  Mail,
  Phone,
  Code2,
  FileText
} from 'lucide-react';

export default function App() {
  const [entries, setEntries] = useState<ClipboardEntry[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [settings, setSettings] = useState<ClipboardSettings>(() => roomDb.getSettings());
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentView, setCurrentView] = useState<'history' | 'collections' | 'inspector' | 'test_suite'>('history');

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [collectionFilter, setCollectionFilter] = useState<string | 'all'>('all');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Multi-Select Mode
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Panels & Modals State
  const [previewEntry, setPreviewEntry] = useState<ClipboardEntry | null>(null);
  const [editEntry, setEditEntry] = useState<ClipboardEntry | null>(null);
  const [isNewClipOpen, setIsNewClipOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEdgeOpen, setIsEdgeOpen] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);

  // Synchronize state from Room Database
  const reloadFromDb = useCallback(() => {
    setEntries(roomDb.getAllEntries());
    setCollections(roomDb.getAllCollections());
    setSettings(roomDb.getSettings());
  }, []);

  // Initial load
  useEffect(() => {
    reloadFromDb();
  }, [reloadFromDb]);

  // Sync dark class on document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Subscribe to Android Clipboard service
  useEffect(() => {
    androidClipboard.setAutoCapture(settings.autoCapture);

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
  }, [settings.autoCapture, reloadFromDb]);

  // Theme toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Copy handler
  const handleCopy = useCallback(async (entry: ClipboardEntry) => {
    await androidClipboard.copyToClipboard(entry.content, entry.contentType.toUpperCase());
    roomDb.incrementCopyCount(entry.id);
    reloadFromDb();
  }, [reloadFromDb]);

  // Pin & Favorite toggles
  const handleTogglePin = (id: string) => {
    roomDb.togglePin(id);
    reloadFromDb();
  };

  const handleToggleFavorite = (id: string) => {
    roomDb.toggleFavorite(id);
    reloadFromDb();
  };

  // Delete single
  const handleDeleteEntry = (id: string) => {
    roomDb.deleteEntry(id);
    if (selectedIds.has(id)) {
      const next = new Set(selectedIds);
      next.delete(id);
      setSelectedIds(next);
    }
    reloadFromDb();
  };

  // Multi-select toggle
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Multi-select bulk actions
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

  // Share action (using Web Share API or fallback)
  const handleShare = async (entry: ClipboardEntry) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FR SHAH QuickPanel Clip',
          text: entry.content,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await handleCopy(entry);
    }
  };

  // Move to collection
  const handleMoveToCollection = (id: string, colId: string | null) => {
    roomDb.updateEntry(id, { collectionId: colId });
    reloadFromDb();
  };

  // Save new clip
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

  // Edit save
  const handleSaveEdit = (id: string, updates: Partial<ClipboardEntry>) => {
    roomDb.updateEntry(id, updates);
    reloadFromDb();
  };

  // Manual device clipboard read
  const handleManualCapture = async () => {
    const text = await androidClipboard.checkForegroundClipboard();
    if (!text && navigator.clipboard?.readText) {
      try {
        const manual = await navigator.clipboard.readText();
        if (manual) {
          roomDb.insertEntry(manual);
          androidClipboard.notifyPrivacyToast('Synced device clipboard', manual.slice(0, 36), 'capture');
          reloadFromDb();
        }
      } catch {
        setIsNewClipOpen(true);
      }
    } else {
      reloadFromDb();
    }
  };

  // Automatic cleanup trigger
  const handleRetentionCleanup = () => {
    const count = roomDb.cleanupExpired(settings.retentionPeriod === 'never' ? '30d' : settings.retentionPeriod);
    androidClipboard.notifyPrivacyToast(`Retention cleanup: purged ${count} expired items`, undefined, 'warning');
    reloadFromDb();
  };

  // Filtered & Sorted Entries
  const filteredEntries = useMemo(() => {
    let list = [...entries];

    // Search query
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

    // Type filter
    if (typeFilter !== 'all') {
      list = list.filter((e) => e.contentType === typeFilter);
    }

    // Collection filter
    if (collectionFilter !== 'all') {
      list = list.filter((e) => e.collectionId === collectionFilter);
    }

    // Only pinned
    if (onlyPinned) {
      list = list.filter((e) => e.isPinned);
    }

    // Only favorites
    if (onlyFavorites) {
      list = list.filter((e) => e.isFavorite);
    }

    // Sorting
    list.sort((a, b) => {
      // If default newest-first: pinned items always float to the top
      if (sortBy === 'newest') {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt - a.createdAt;
      }
      if (sortBy === 'oldest') {
        return a.createdAt - b.createdAt;
      }
      if (sortBy === 'alphabetical') {
        return a.content.localeCompare(b.content);
      }
      if (sortBy === 'most_copied') {
        return b.copyCount - a.copyCount;
      }
      return 0;
    });

    return list;
  }, [entries, searchQuery, typeFilter, collectionFilter, onlyPinned, onlyFavorites, sortBy]);

  // KPI metrics
  const pinnedCount = useMemo(() => entries.filter((e) => e.isPinned).length, [entries]);
  const favoriteCount = useMemo(() => entries.filter((e) => e.isFavorite).length, [entries]);
  const dbStats = useMemo(() => roomDb.getDatabaseStats(), [entries]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar following design contract */}
      <Header
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNewClip={() => setIsNewClipOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleEdgePanel={() => setIsEdgeOpen(!isEdgeOpen)}
        onToggleFloatingPanel={() => setIsFloatingOpen(!isFloatingOpen)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isEdgeOpen={isEdgeOpen}
        isFloatingOpen={isFloatingOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* QuickPanel Status Banner & Command Strip */}
        <QuickPanelDashboard
          totalCount={entries.length}
          pinnedCount={pinnedCount}
          favoriteCount={favoriteCount}
          storageFormatted={dbStats.storageFormatted}
          settings={settings}
          onManualCaptureFromSystem={handleManualCapture}
          onTriggerCleanup={handleRetentionCleanup}
          onToggleEdgePanel={() => setIsEdgeOpen(!isEdgeOpen)}
          onToggleFloatingPanel={() => setIsFloatingOpen(!isFloatingOpen)}
          isEdgeOpen={isEdgeOpen}
          isFloatingOpen={isFloatingOpen}
        />

        {/* VIEW 1: Clipboard History & Clips */}
        {currentView === 'history' && (
          <div className="space-y-4">
            {/* Search & Filter Bar (Interactive Buttons & Segmented Controls) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clipboard history by text, domain, or #tag..."
                    className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Option & Multi-Select Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="newest" className="dark:bg-slate-900">Newest First</option>
                      <option value="oldest" className="dark:bg-slate-900">Oldest First</option>
                      <option value="most_copied" className="dark:bg-slate-900">Most Copied</option>
                      <option value="alphabetical" className="dark:bg-slate-900">Alphabetical (A-Z)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setIsMultiSelect(!isMultiSelect);
                      setSelectedIds(new Set());
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isMultiSelect
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Select</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs / Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                {/* Content Category Filters */}
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <button
                    onClick={() => setTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      typeFilter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => setTypeFilter('url')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'url'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>URLs</span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('code')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'code'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('email')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'email'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Emails</span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('phone')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'phone'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phones</span>
                  </button>
                  <button
                    onClick={() => setTypeFilter('plain_text')}
                    className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors ${
                      typeFilter === 'plain_text'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Plain Text</span>
                  </button>
                </div>

                {/* Pin & Star Fast Filter Toggles */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setOnlyPinned(!onlyPinned)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      onlyPinned
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <Pin className={`w-3.5 h-3.5 ${onlyPinned ? 'fill-amber-500' : ''}`} />
                    <span>Pinned ({pinnedCount})</span>
                  </button>

                  <button
                    onClick={() => setOnlyFavorites(!onlyFavorites)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      onlyFavorites
                        ? 'bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/40'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-pink-500' : ''}`} />
                    <span>Favorites ({favoriteCount})</span>
                  </button>
                </div>
              </div>

              {/* Collections Bar */}
              {collections.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto pt-1 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                    Folder:
                  </span>
                  <button
                    onClick={() => setCollectionFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      collectionFilter === 'all'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    All Collections
                  </button>
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setCollectionFilter(col.id)}
                      className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                        collectionFilter === col.id
                          ? 'border border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-700 dark:text-indigo-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Multi-Select Floating Action Bar */}
            {isMultiSelect && (
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSelectAll(filteredEntries)}
                    className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:underline flex items-center gap-1.5"
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
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold tabular-nums">
                    {selectedIds.size} of {filteredEntries.length} selected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Bulk Move Dropdown */}
                  <div className="relative group">
                    <button className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
                      <FolderInput className="w-3.5 h-3.5" />
                      <span>Move to Collection</span>
                    </button>
                    <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-30">
                      <button
                        onClick={() => handleBulkMove(null)}
                        className="w-full px-3 py-1 text-xs text-left text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        None
                      </button>
                      {collections.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleBulkMove(c.id)}
                          className="w-full px-3 py-1 text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedIds.size === 0}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected</span>
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredEntries.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {searchQuery || typeFilter !== 'all' || collectionFilter !== 'all'
                    ? 'No matching clips found'
                    : 'Clipboard history is currently empty'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || typeFilter !== 'all' || collectionFilter !== 'all'
                    ? 'Try adjusting your search query, clearing category filters, or selecting a different folder.'
                    : 'Copy text in any application or use the button below to paste or add clips to FR SHAH QuickPanel.'}
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setTypeFilter('all');
                      setCollectionFilter('all');
                      setOnlyPinned(false);
                      setOnlyFavorites(false);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={() => setIsNewClipOpen(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                  >
                    Add New Clip
                  </button>
                </div>
              </div>
            ) : (
              /* Clipboard Entries Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredEntries.map((entry) => {
                  const col = collections.find((c) => c.id === entry.collectionId);
                  return (
                    <ClipboardCard
                      key={entry.id}
                      entry={entry}
                      collection={col}
                      collections={collections}
                      appearance={settings.cardAppearance}
                      isSelected={selectedIds.has(entry.id)}
                      isMultiSelectMode={isMultiSelect}
                      onToggleSelect={handleToggleSelect}
                      onCopy={handleCopy}
                      onTogglePin={handleTogglePin}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDeleteEntry}
                      onPreview={(e) => setPreviewEntry(e)}
                      onEdit={(e) => setEditEntry(e)}
                      onMoveToCollection={handleMoveToCollection}
                      onShare={handleShare}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Collections Manager */}
        {currentView === 'collections' && (
          <CollectionsManager
            collections={collections}
            entries={entries}
            onAddCollection={(newCol) => {
              roomDb.addCollection(newCol);
              reloadFromDb();
            }}
            onUpdateCollection={(id, updates) => {
              roomDb.updateCollection(id, updates);
              reloadFromDb();
            }}
            onDeleteCollection={(id) => {
              roomDb.deleteCollection(id);
              reloadFromDb();
            }}
            onSelectCollectionFilter={(colId) => {
              setCollectionFilter(colId);
              setCurrentView('history');
            }}
          />
        )}

        {/* VIEW 3: Room Database Inspector */}
        {currentView === 'inspector' && (
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

        {/* VIEW 4: Verification & Test Simulation Suite */}
        {currentView === 'test_suite' && (
          <TestSimulationSuite
            settings={settings}
            onRefreshData={reloadFromDb}
          />
        )}
      </main>

      {/* Footer (Quiet copyright and developer credit) */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-200">FR SHAH QuickPanel</span>
            <span aria-hidden="true">·</span>
            <span>Smart Clipboard Manager</span>
            <span aria-hidden="true">·</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">MADE BY FR SHAH</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Room Database v2.6.1</span>
            <span aria-hidden="true">·</span>
            <span>Foreground Gated</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Server Privacy Guarantee</span>
          </div>
        </div>
      </footer>

      {/* Modals & Slide-out Drawers */}
      <ClipboardPreviewModal
        entry={previewEntry}
        collection={collections.find((c) => c.id === previewEntry?.collectionId)}
        collections={collections}
        onClose={() => setPreviewEntry(null)}
        onCopy={handleCopy}
        onTogglePin={handleTogglePin}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteEntry}
        onEdit={(e) => setEditEntry(e)}
        onMoveToCollection={handleMoveToCollection}
        onShare={handleShare}
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
        onSave={handleSaveEdit}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          roomDb.saveSettings(newSettings);
          reloadFromDb();
        }}
        onWipeHistory={(preservePinned) => {
          roomDb.wipeAll(preservePinned);
          reloadFromDb();
        }}
      />

      {/* Samsung One UI / Android Style Edge Panel */}
      <EdgePanel
        isOpen={isEdgeOpen}
        onToggle={() => setIsEdgeOpen(!isEdgeOpen)}
        entries={entries}
        collections={collections}
        onCopy={handleCopy}
        onOpenNewClip={() => setIsNewClipOpen(true)}
        onOpenFullDashboard={() => {
          setCurrentView('history');
          setIsEdgeOpen(false);
        }}
      />

      {/* Android Freeform / Floating QuickPanel Widget */}
      <FloatingPanel
        isOpen={isFloatingOpen}
        onClose={() => setIsFloatingOpen(false)}
        entries={entries}
        collections={collections}
        onCopy={handleCopy}
        onOpenNewClip={() => setIsNewClipOpen(true)}
        onOpenFullDashboard={() => {
          setCurrentView('history');
          setIsFloatingOpen(false);
        }}
      />

      {/* Android 13+ Visual Privacy Pill / Toast */}
      {settings.showAndroidPrivacyChip && <AndroidPrivacyChip />}
    </div>
  );
}
