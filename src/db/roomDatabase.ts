/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Android Room Database Local Persistence Layer (Room DAO & Entity Simulator)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import { ClipboardEntry, Collection, ClipboardSettings, RetentionPeriod } from '../types/clipboard';
import { generateContentHash, classifyContent, detectSensitive } from '../utils/classifier';

const DB_STORAGE_KEY = 'fr_shah_room_clipboard_db_v2';
const COLLECTIONS_STORAGE_KEY = 'fr_shah_room_collections_v2';
const SETTINGS_STORAGE_KEY = 'fr_shah_room_settings_v2';

export const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: 'col-study',
    name: 'Study',
    description: 'Course notes, research articles, definitions',
    color: '#6366F1', // Indigo
    icon: 'BookOpen',
    createdAt: Date.now() - 86400000 * 5,
    isDefault: true,
  },
  {
    id: 'col-coding',
    name: 'Coding',
    description: 'Snippets, command lines, regex, API schemas',
    color: '#06B6D4', // Cyan
    icon: 'Code2',
    createdAt: Date.now() - 86400000 * 4,
    isDefault: true,
  },
  {
    id: 'col-business',
    name: 'Business',
    description: 'Proposals, invoices, contact details, pitches',
    color: '#10B981', // Emerald
    icon: 'Briefcase',
    createdAt: Date.now() - 86400000 * 3,
    isDefault: true,
  },
  {
    id: 'col-vocab',
    name: 'English Vocabulary',
    description: 'Idioms, advanced vocabulary, pronunciation keys',
    color: '#F59E0B', // Amber
    icon: 'Languages',
    createdAt: Date.now() - 86400000 * 2,
    isDefault: true,
  },
  {
    id: 'col-personal',
    name: 'Personal',
    description: 'Addresses, wishlists, personal notes',
    color: '#EC4899', // Pink
    icon: 'Heart',
    createdAt: Date.now() - 86400000 * 1,
    isDefault: true,
  },
  {
    id: 'col-important',
    name: 'Important',
    description: 'Critical snippets and high-priority references',
    color: '#EF4444', // Red
    icon: 'AlertCircle',
    createdAt: Date.now(),
    isDefault: true,
  },
];

export const DEFAULT_SETTINGS: ClipboardSettings = {
  autoCapture: true,
  historyCapacity: 500,
  retentionPeriod: 'never',
  filterSensitive: true,
  sensitiveAction: 'warn',
  cardAppearance: {
    density: 'standard',
    fontSize: 'md',
    showTimestamp: true,
    showCharCount: true,
    showContentTypeBadge: true,
    monospaceCode: true,
  },
  theme: 'dark',
  edgePanelPosition: 'right',
  edgePanelWidth: 380,
  showAndroidPrivacyChip: true,
  confirmBeforeWipe: true,
};

// Seed sample entries so the user immediately experiences realistic data on fresh launch
export function getInitialSeedEntries(): ClipboardEntry[] {
  const now = Date.now();
  return [
    {
      id: 'clip-seed-1',
      content: 'https://github.com/shahfauzan/quickpanel-android-suite',
      contentType: 'url',
      createdAt: now - 1000 * 60 * 12,
      updatedAt: now - 1000 * 60 * 12,
      isPinned: true,
      isFavorite: true,
      collectionId: 'col-coding',
      contentHash: generateContentHash('https://github.com/shahfauzan/quickpanel-android-suite'),
      tags: ['android', 'quickpanel', 'github'],
      copyCount: 7,
      metadata: {
        charCount: 55,
        wordCount: 1,
        lineCount: 1,
        urlDomain: 'github.com',
      },
    },
    {
      id: 'clip-seed-2',
      content: `// FR SHAH Room Database DAO\n@Dao\ninterface ClipboardDao {\n  @Query("SELECT * FROM clipboard_entries ORDER BY createdAt DESC")\n  fun getAllEntries(): Flow<List<ClipboardEntry>>\n\n  @Insert(onConflict = OnConflictStrategy.REPLACE)\n  suspend fun insertOrUpdate(entry: ClipboardEntry): Long\n}`,
      contentType: 'code',
      createdAt: now - 1000 * 60 * 45,
      updatedAt: now - 1000 * 60 * 45,
      isPinned: true,
      isFavorite: false,
      collectionId: 'col-coding',
      contentHash: generateContentHash('// FR SHAH Room Database DAO'),
      tags: ['kotlin', 'room', 'database'],
      copyCount: 12,
      metadata: {
        charCount: 260,
        wordCount: 22,
        lineCount: 9,
        codeLanguage: 'Java / Kotlin',
      },
    },
    {
      id: 'clip-seed-3',
      content: 'shahfauzan49@gmail.com',
      contentType: 'email',
      createdAt: now - 1000 * 60 * 95,
      updatedAt: now - 1000 * 60 * 95,
      isPinned: false,
      isFavorite: true,
      collectionId: 'col-business',
      contentHash: generateContentHash('shahfauzan49@gmail.com'),
      tags: ['contact', 'email', 'developer'],
      copyCount: 4,
      metadata: {
        charCount: 22,
        wordCount: 1,
        lineCount: 1,
      },
    },
    {
      id: 'clip-seed-4',
      content: '+1 (555) 438-2910',
      contentType: 'phone',
      createdAt: now - 1000 * 60 * 180,
      updatedAt: now - 1000 * 60 * 180,
      isPinned: false,
      isFavorite: false,
      collectionId: 'col-personal',
      contentHash: generateContentHash('+1 (555) 438-2910'),
      tags: ['support', 'office'],
      copyCount: 2,
      metadata: {
        charCount: 17,
        wordCount: 3,
        lineCount: 1,
      },
    },
    {
      id: 'clip-seed-5',
      content: 'Serendipity (noun): The occurrence and development of events by chance in a happy or beneficial way. Example: "A fortunate stroke of serendipity brought the two engineers together."',
      contentType: 'plain_text',
      createdAt: now - 1000 * 60 * 360,
      updatedAt: now - 1000 * 60 * 360,
      isPinned: false,
      isFavorite: true,
      collectionId: 'col-vocab',
      contentHash: generateContentHash('Serendipity (noun): The occurrence and development of events'),
      tags: ['vocabulary', 'english', 'idiom'],
      copyCount: 3,
      metadata: {
        charCount: 177,
        wordCount: 24,
        lineCount: 1,
      },
    },
    {
      id: 'clip-seed-6',
      content: 'Meeting with UI/UX architecture team at 3:30 PM CST. Review Android 14 Predictive Back Gesture animations and FR SHAH QuickPanel Floating Window physics.',
      contentType: 'other',
      createdAt: now - 1000 * 60 * 600,
      updatedAt: now - 1000 * 60 * 600,
      isPinned: false,
      isFavorite: false,
      collectionId: 'col-study',
      contentHash: generateContentHash('Meeting with UI/UX architecture team at 3:30 PM CST.'),
      tags: ['schedule', 'agenda'],
      copyCount: 1,
      metadata: {
        charCount: 153,
        wordCount: 22,
        lineCount: 1,
      },
    },
  ];
}

/**
 * Room Database Repository Implementation
 */
class RoomDatabaseManager {
  private entries: Map<string, ClipboardEntry> = new Map();
  private collections: Map<string, Collection> = new Map();
  private settings: ClipboardSettings = DEFAULT_SETTINGS;
  private isLoaded = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    try {
      // 1. Load Settings
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      }

      // 2. Load Collections
      const savedCollections = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (savedCollections) {
        const parsedCols: Collection[] = JSON.parse(savedCollections);
        parsedCols.forEach((col) => this.collections.set(col.id, col));
      } else {
        DEFAULT_COLLECTIONS.forEach((col) => this.collections.set(col.id, col));
        this.saveCollections();
      }

      // 3. Load Entries
      const savedEntries = localStorage.getItem(DB_STORAGE_KEY);
      if (savedEntries) {
        const parsed: ClipboardEntry[] = JSON.parse(savedEntries);
        parsed.forEach((entry) => this.entries.set(entry.id, entry));
      } else {
        getInitialSeedEntries().forEach((entry) => this.entries.set(entry.id, entry));
        this.saveEntries();
      }

      this.isLoaded = true;
      // Run automatic cleanup on init based on retention policy
      this.cleanupExpired(this.settings.retentionPeriod);
    } catch (e) {
      console.error('Failed to initialize Room Database:', e);
    }
  }

  private saveEntries() {
    if (typeof window === 'undefined') return;
    try {
      const arr = Array.from(this.entries.values());
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {
      console.warn('Storage quota exceeded, removing oldest non-pinned items...', e);
      this.enforceCapacity(100);
    }
  }

  private saveCollections() {
    if (typeof window === 'undefined') return;
    try {
      const arr = Array.from(this.collections.values());
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(arr));
    } catch (e) {
      console.error('Failed to save collections:', e);
    }
  }

  public saveSettings(newSettings: ClipboardSettings) {
    this.settings = newSettings;
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  public getSettings(): ClipboardSettings {
    return { ...this.settings };
  }

  public getAllCollections(): Collection[] {
    return Array.from(this.collections.values());
  }

  public addCollection(collection: Omit<Collection, 'id' | 'createdAt'>): Collection {
    const id = `col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newCol: Collection = {
      ...collection,
      id,
      createdAt: Date.now(),
    };
    this.collections.set(id, newCol);
    this.saveCollections();
    return newCol;
  }

  public updateCollection(id: string, updates: Partial<Collection>): Collection | null {
    const existing = this.collections.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.collections.set(id, updated);
    this.saveCollections();
    return updated;
  }

  public deleteCollection(id: string): boolean {
    const col = this.collections.get(id);
    if (!col) return false;
    // Unassign entries belonging to this collection
    for (const [entryId, entry] of this.entries.entries()) {
      if (entry.collectionId === id) {
        this.entries.set(entryId, { ...entry, collectionId: null });
      }
    }
    this.collections.delete(id);
    this.saveCollections();
    this.saveEntries();
    return true;
  }

  public getAllEntries(): ClipboardEntry[] {
    return Array.from(this.entries.values()).sort((a, b) => {
      // Pinned items bubble to top if requested, but default order is newest-first
      return b.createdAt - a.createdAt;
    });
  }

  public getEntryById(id: string): ClipboardEntry | undefined {
    return this.entries.get(id);
  }

  /**
   * Insert or update entry with duplicate detection, capacity limit enforcement,
   * and pinned item preservation.
   */
  public insertEntry(
    rawText: string,
    options?: {
      collectionId?: string | null;
      tags?: string[];
      isPinned?: boolean;
      forceSaveSensitive?: boolean;
    }
  ): { entry: ClipboardEntry; isDuplicate: boolean; wasSensitiveBlocked?: boolean } {
    const content = rawText.trim();
    if (!content) throw new Error('Cannot insert empty clipboard content');

    const contentHash = generateContentHash(content);
    const sensitive = detectSensitive(content);

    // If sensitive content is detected and filter policy is 'block', unless user explicitly forced save:
    if (sensitive && this.settings.filterSensitive && this.settings.sensitiveAction === 'block' && !options?.forceSaveSensitive) {
      return {
        entry: null as unknown as ClipboardEntry,
        isDuplicate: false,
        wasSensitiveBlocked: true,
      };
    }

    // Duplicate detection: check if contentHash already exists in the Room table
    for (const existing of this.entries.values()) {
      if (existing.contentHash === contentHash || existing.content === content) {
        // Bump timestamp to now and increment copyCount
        const updated: ClipboardEntry = {
          ...existing,
          updatedAt: Date.now(),
          createdAt: Date.now(), // brings to top in newest-first list
          copyCount: existing.copyCount + 1,
          collectionId: options?.collectionId !== undefined ? options.collectionId : existing.collectionId,
          isPinned: options?.isPinned !== undefined ? options.isPinned : existing.isPinned,
          tags: options?.tags ? Array.from(new Set([...existing.tags, ...options.tags])) : existing.tags,
        };
        this.entries.set(existing.id, updated);
        this.saveEntries();
        return { entry: updated, isDuplicate: true };
      }
    }

    // New entry creation
    const { contentType, metadata } = classifyContent(content);
    const id = `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const shouldRedact = sensitive && this.settings.filterSensitive && this.settings.sensitiveAction === 'redact';

    const newEntry: ClipboardEntry = {
      id,
      content,
      contentType,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: options?.isPinned ?? false,
      isFavorite: false,
      collectionId: options?.collectionId ?? null,
      contentHash,
      tags: options?.tags ?? [],
      copyCount: 1,
      detectedSensitive: sensitive,
      isRedacted: shouldRedact,
      metadata,
    };

    this.entries.set(id, newEntry);

    // Enforce history capacity limit
    this.enforceCapacity(this.settings.historyCapacity);
    this.saveEntries();

    return { entry: newEntry, isDuplicate: false };
  }

  /**
   * Enforces capacity limit (100, 250, 500, 1000).
   * CRITICAL REQUIREMENT: Preserves pinned entries during cleanup!
   */
  public enforceCapacity(capacityLimit: number): number {
    const total = this.entries.size;
    if (total <= capacityLimit) return 0;

    const excess = total - capacityLimit;
    // Get all non-pinned entries sorted oldest-first
    const unpinnedOldest = Array.from(this.entries.values())
      .filter((e) => !e.isPinned)
      .sort((a, b) => a.createdAt - b.createdAt);

    let removed = 0;
    for (let i = 0; i < unpinnedOldest.length && removed < excess; i++) {
      this.entries.delete(unpinnedOldest[i].id);
      removed++;
    }

    if (removed > 0) {
      this.saveEntries();
    }
    return removed;
  }

  /**
   * Automatic cleanup based on retention period.
   * CRITICAL REQUIREMENT: Preserves pinned entries during automatic cleanup!
   */
  public cleanupExpired(retention: RetentionPeriod): number {
    if (retention === 'never') return 0;

    const msMap: Record<Exclude<RetentionPeriod, 'never'>, number> = {
      '1h': 1000 * 60 * 60,
      '24h': 1000 * 60 * 60 * 24,
      '7d': 1000 * 60 * 60 * 24 * 7,
      '30d': 1000 * 60 * 60 * 24 * 30,
    };

    const threshold = Date.now() - msMap[retention];
    let count = 0;

    for (const [id, entry] of this.entries.entries()) {
      // Never delete pinned entries during automatic cleanup
      if (!entry.isPinned && entry.createdAt < threshold) {
        this.entries.delete(id);
        count++;
      }
    }

    if (count > 0) {
      this.saveEntries();
    }
    return count;
  }

  public updateEntry(id: string, updates: Partial<ClipboardEntry>): ClipboardEntry | null {
    const existing = this.entries.get(id);
    if (!existing) return null;

    let updatedContent = updates.content !== undefined ? updates.content : existing.content;
    let newHash = existing.contentHash;
    let classification = { contentType: existing.contentType, metadata: existing.metadata };

    if (updates.content !== undefined && updates.content !== existing.content) {
      newHash = generateContentHash(updatedContent);
      classification = classifyContent(updatedContent);
    }

    const updated: ClipboardEntry = {
      ...existing,
      ...updates,
      content: updatedContent,
      contentHash: newHash,
      contentType: updates.contentType || classification.contentType,
      metadata: classification.metadata,
      updatedAt: Date.now(),
    };

    this.entries.set(id, updated);
    this.saveEntries();
    return updated;
  }

  public togglePin(id: string): boolean {
    const entry = this.entries.get(id);
    if (!entry) return false;
    entry.isPinned = !entry.isPinned;
    entry.updatedAt = Date.now();
    this.saveEntries();
    return entry.isPinned;
  }

  public toggleFavorite(id: string): boolean {
    const entry = this.entries.get(id);
    if (!entry) return false;
    entry.isFavorite = !entry.isFavorite;
    entry.updatedAt = Date.now();
    this.saveEntries();
    return entry.isFavorite;
  }

  public incrementCopyCount(id: string): number {
    const entry = this.entries.get(id);
    if (!entry) return 0;
    entry.copyCount += 1;
    entry.updatedAt = Date.now();
    this.saveEntries();
    return entry.copyCount;
  }

  public deleteEntry(id: string): boolean {
    const deleted = this.entries.delete(id);
    if (deleted) this.saveEntries();
    return deleted;
  }

  public deleteMultiple(ids: string[]): number {
    let deletedCount = 0;
    for (const id of ids) {
      if (this.entries.delete(id)) {
        deletedCount++;
      }
    }
    if (deletedCount > 0) this.saveEntries();
    return deletedCount;
  }

  public assignMultipleToCollection(ids: string[], collectionId: string | null): number {
    let count = 0;
    for (const id of ids) {
      const entry = this.entries.get(id);
      if (entry) {
        entry.collectionId = collectionId;
        entry.updatedAt = Date.now();
        count++;
      }
    }
    if (count > 0) this.saveEntries();
    return count;
  }

  public wipeAll(preservePinned = false): { deleted: number; preserved: number } {
    let deleted = 0;
    let preserved = 0;

    for (const [id, entry] of this.entries.entries()) {
      if (preservePinned && entry.isPinned) {
        preserved++;
      } else {
        this.entries.delete(id);
        deleted++;
      }
    }
    this.saveEntries();
    return { deleted, preserved };
  }

  public getDatabaseStats() {
    const entriesList = Array.from(this.entries.values());
    const pinnedCount = entriesList.filter((e) => e.isPinned).length;
    const favoriteCount = entriesList.filter((e) => e.isFavorite).length;
    const sensitiveCount = entriesList.filter((e) => e.detectedSensitive).length;
    const rawJson = JSON.stringify(entriesList);
    const bytesEstimate = new Blob([rawJson]).size;

    return {
      table: 'clipboard_entries',
      roomVersion: 'v2.6.1 · androidx.room:room-runtime',
      totalRows: entriesList.length,
      pinnedCount,
      favoriteCount,
      sensitiveCount,
      totalCollections: this.collections.size,
      storageBytes: bytesEstimate,
      storageFormatted: `${(bytesEstimate / 1024).toFixed(1)} KB`,
      indices: ['index_contentHash', 'index_createdAt_desc', 'index_collectionId', 'index_isPinned', 'index_isFavorite'],
    };
  }

  public exportBackupJson(): string {
    const payload = {
      version: 2,
      exportDate: new Date().toISOString(),
      creator: 'MADE BY FR SHAH',
      settings: this.settings,
      collections: Array.from(this.collections.values()),
      entries: Array.from(this.entries.values()),
    };
    return JSON.stringify(payload, null, 2);
  }

  public importBackupJson(jsonString: string): { importedEntries: number; importedCollections: number } {
    const parsed = JSON.parse(jsonString);
    let importedEntries = 0;
    let importedCollections = 0;

    if (Array.isArray(parsed.collections)) {
      for (const col of parsed.collections) {
        if (col.id && col.name) {
          this.collections.set(col.id, col);
          importedCollections++;
        }
      }
      this.saveCollections();
    }

    if (Array.isArray(parsed.entries)) {
      for (const entry of parsed.entries) {
        if (entry.id && entry.content) {
          this.entries.set(entry.id, entry);
          importedEntries++;
        }
      }
      this.saveEntries();
    }

    if (parsed.settings) {
      this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
    }

    return { importedEntries, importedCollections };
  }
}

// Singleton Room DB instance
export const roomDb = new RoomDatabaseManager();
