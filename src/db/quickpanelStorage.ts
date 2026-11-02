/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Local Room Database & DataStore Preferences Engine
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import { 
  ToolDefinition, 
  ToolId, 
  QuickPanelCustomization, 
  NoteItem, 
  ScreenshotItem, 
  RecordingItem, 
  AppShortcutItem, 
  PermissionStatus, 
  PermissionId 
} from '../types/quickpanel';

const STORAGE_KEYS = {
  TOOLS: 'fr_shah_qp_tools_v1',
  SETTINGS: 'fr_shah_qp_customization_v1',
  NOTES: 'fr_shah_qp_notes_v1',
  SCREENSHOTS: 'fr_shah_qp_screenshots_v1',
  RECORDINGS: 'fr_shah_qp_recordings_v1',
  APPS: 'fr_shah_qp_apps_v1',
  PERMISSIONS: 'fr_shah_qp_permissions_v1',
};

export const DEFAULT_TOOLS: ToolDefinition[] = [
  {
    id: 'clipboard',
    name: 'Smart Clipboard',
    category: 'productivity',
    description: 'Room DB persistent clipboard history with smart classification',
    icon: 'ClipboardList',
    enabled: true,
    order: 0,
    badge: 'Room DB',
  },
  {
    id: 'screenshot',
    name: 'Screenshot Tools',
    category: 'media',
    description: 'Capture, organize, and preview Pictures/FR SHAH QuickPanel',
    icon: 'Camera',
    enabled: true,
    order: 1,
  },
  {
    id: 'recorder',
    name: 'Screen Recorder',
    category: 'media',
    description: 'MediaProjection foreground recording with status indicators',
    icon: 'Video',
    enabled: true,
    order: 2,
    badge: 'MediaProjection',
  },
  {
    id: 'flashlight',
    name: 'Flashlight & Torch',
    category: 'system',
    description: 'Camera flash control with strobe and SOS distress signals',
    icon: 'Flashlight',
    enabled: true,
    order: 3,
  },
  {
    id: 'volume',
    name: 'Volume & Display',
    category: 'system',
    description: 'Media & ring volume sliders with window brightness control',
    icon: 'SlidersHorizontal',
    enabled: true,
    order: 4,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    category: 'utility',
    description: 'Arithmetic engine with memory registers and calculation history',
    icon: 'Calculator',
    enabled: true,
    order: 5,
  },
  {
    id: 'notes',
    name: 'Quick Notes',
    category: 'productivity',
    description: 'Encrypted local notes with pin protection and full-text search',
    icon: 'FileText',
    enabled: true,
    order: 6,
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    category: 'utility',
    description: 'SystemClock.elapsedRealtime precision timer with lap tracking',
    icon: 'Timer',
    enabled: true,
    order: 7,
  },
  {
    id: 'qrscanner',
    name: 'QR & Barcode Scanner',
    category: 'utility',
    description: 'CameraX QR detector with safe URL confirmation',
    icon: 'QrCode',
    enabled: true,
    order: 8,
  },
  {
    id: 'appshortcuts',
    name: 'App Shortcuts',
    category: 'system',
    description: 'Quick launcher for frequently used installed applications',
    icon: 'Grid',
    enabled: true,
    order: 9,
  },
];

export const DEFAULT_CUSTOMIZATION: QuickPanelCustomization = {
  theme: 'dark',
  accentTone: 'carbon', // sleek black/grey tone
  dashboardColumns: 3,
  iconStyle: 'minimal',
  cardRadius: 'large',
  hapticFeedback: true,
  floatingConfig: {
    enabled: true,
    positionX: 88, // % from left
    positionY: 72, // % from top
    size: 'medium',
    opacity: 90,
    longPressShortcut: 'clipboard',
    hideWhenFullscreen: false,
  },
  edgeConfig: {
    enabled: true,
    position: 'right',
    width: 360,
    opacity: 92,
    triggerHeight: 88,
    triggerOffset: 50,
  },
};

export const DEFAULT_PERMISSIONS: PermissionStatus[] = [
  {
    id: 'SYSTEM_ALERT_WINDOW',
    name: 'Display Over Other Apps',
    description: 'Required to draw the Floating QuickPanel button on top of active applications.',
    requiredFor: 'Floating QuickPanel',
    isGranted: true,
    isCritical: true,
  },
  {
    id: 'CAMERA',
    name: 'Camera Access',
    description: 'Required strictly when triggering Camera torch mode or scanning QR codes.',
    requiredFor: 'Flashlight & QR Scanner',
    isGranted: true,
    isCritical: false,
  },
  {
    id: 'FOREGROUND_SERVICE',
    name: 'Foreground Service',
    description: 'Permits non-interrupted screen recording and floating widget state.',
    requiredFor: 'Screen Recorder & Floating Service',
    isGranted: true,
    isCritical: true,
  },
  {
    id: 'POST_NOTIFICATIONS',
    name: 'Notifications (Android 13+)',
    description: 'Displays active screen recording controls and clipboard privacy toasts.',
    requiredFor: 'Status Notifications',
    isGranted: true,
    isCritical: false,
  },
  {
    id: 'WRITE_SETTINGS',
    name: 'Modify System Settings',
    description: 'Optional authorization for adjusting global device screen brightness.',
    requiredFor: 'System Brightness Override',
    isGranted: false,
    isCritical: false,
  },
  {
    id: 'MEDIA_PROJECTION',
    name: 'MediaProjection Consent',
    description: 'Explicit user agreement prompt before capturing screen or recording display.',
    requiredFor: 'Screenshots & Screen Recording',
    isGranted: true,
    isCritical: true,
  },
];

export const DEFAULT_APPS: AppShortcutItem[] = [
  { id: 'app-phone', packageName: 'com.android.dialer', label: 'Phone', category: 'Communication', iconName: 'Phone', isFavorite: true, order: 0 },
  { id: 'app-messages', packageName: 'com.google.android.apps.messaging', label: 'Messages', category: 'Communication', iconName: 'MessageSquare', isFavorite: true, order: 1 },
  { id: 'app-camera', packageName: 'com.motorola.camera3', label: 'Moto Camera', category: 'Media', iconName: 'Camera', isFavorite: true, order: 2 },
  { id: 'app-chrome', packageName: 'com.android.chrome', label: 'Chrome', category: 'Internet', iconName: 'Globe', isFavorite: true, order: 3 },
  { id: 'app-settings', packageName: 'com.android.settings', label: 'Settings', category: 'System', iconName: 'Settings', isFavorite: true, order: 4 },
  { id: 'app-gallery', packageName: 'com.google.android.apps.photos', label: 'Photos', category: 'Media', iconName: 'Image', isFavorite: false, order: 5 },
  { id: 'app-files', packageName: 'com.google.android.apps.nbu.files', label: 'Files', category: 'Utility', iconName: 'Folder', isFavorite: false, order: 6 },
  { id: 'app-clock', packageName: 'com.google.android.deskclock', label: 'Clock', category: 'Utility', iconName: 'Clock', isFavorite: false, order: 7 },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Moto G75 5G Calibration',
    content: 'Verify Snapdragon 6 Gen 3 refresh rate at 120Hz. Floating QuickPanel touch dispatch latency stable at 14ms.',
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
    isPinned: true,
    tags: ['android16', 'performance', 'g75'],
  },
  {
    id: 'note-2',
    title: 'FR SHAH QuickPanel Architecture',
    content: 'Clean MVVM structure with Hilt DI. DataStore for preferences, Room DAO for clipboard and notes. Zero purple color policy maintained.',
    createdAt: Date.now() - 3600000 * 8,
    updatedAt: Date.now() - 3600000 * 8,
    isPinned: false,
    tags: ['architecture', 'design'],
  },
];

class QuickPanelStorageService {
  private tools: ToolDefinition[] = DEFAULT_TOOLS;
  private settings: QuickPanelCustomization = DEFAULT_CUSTOMIZATION;
  private notes: NoteItem[] = INITIAL_NOTES;
  private screenshots: ScreenshotItem[] = [];
  private recordings: RecordingItem[] = [];
  private apps: AppShortcutItem[] = DEFAULT_APPS;
  private permissions: PermissionStatus[] = DEFAULT_PERMISSIONS;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    try {
      // 1. Settings / Customization
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        this.settings = { ...DEFAULT_CUSTOMIZATION, ...JSON.parse(savedSettings) };
      }

      // 2. Tools
      const savedTools = localStorage.getItem(STORAGE_KEYS.TOOLS);
      if (savedTools) {
        this.tools = JSON.parse(savedTools);
      }

      // 3. Notes
      const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (savedNotes) {
        this.notes = JSON.parse(savedNotes);
      }

      // 4. Screenshots
      const savedScreenshots = localStorage.getItem(STORAGE_KEYS.SCREENSHOTS);
      if (savedScreenshots) {
        this.screenshots = JSON.parse(savedScreenshots);
      }

      // 5. Recordings
      const savedRecordings = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
      if (savedRecordings) {
        this.recordings = JSON.parse(savedRecordings);
      }

      // 6. Apps
      const savedApps = localStorage.getItem(STORAGE_KEYS.APPS);
      if (savedApps) {
        this.apps = JSON.parse(savedApps);
      }

      // 7. Permissions
      const savedPerms = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
      if (savedPerms) {
        this.permissions = JSON.parse(savedPerms);
      }
    } catch (e) {
      console.error('Error initializing QuickPanel storage:', e);
    }
  }

  // --- TOOLS METHODS ---
  public getTools(): ToolDefinition[] {
    return [...this.tools].sort((a, b) => a.order - b.order);
  }

  public setToolEnabled(id: ToolId, enabled: boolean) {
    this.tools = this.tools.map((t) => (t.id === id ? { ...t, enabled } : t));
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(this.tools));
  }

  public reorderTools(newOrderIds: ToolId[]) {
    this.tools = this.tools.map((t) => {
      const idx = newOrderIds.indexOf(t.id);
      return idx !== -1 ? { ...t, order: idx } : t;
    });
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(this.tools));
  }

  // --- CUSTOMIZATION METHODS ---
  public getCustomization(): QuickPanelCustomization {
    return { ...this.settings };
  }

  public saveCustomization(settings: QuickPanelCustomization) {
    this.settings = settings;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  public resetCustomizationToDefault(): QuickPanelCustomization {
    this.settings = { ...DEFAULT_CUSTOMIZATION };
    this.tools = [...DEFAULT_TOOLS];
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings));
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(this.tools));
    return this.settings;
  }

  // --- NOTES METHODS (ROOM DB) ---
  public getNotes(): NoteItem[] {
    return [...this.notes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }

  public saveNote(title: string, content: string, tags: string[] = []): NoteItem {
    const id = `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newNote: NoteItem = {
      id,
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
      tags,
    };
    this.notes = [newNote, ...this.notes];
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(this.notes));
    return newNote;
  }

  public updateNote(id: string, updates: Partial<NoteItem>): NoteItem | null {
    const note = this.notes.find((n) => n.id === id);
    if (!note) return null;
    const updated = { ...note, ...updates, updatedAt: Date.now() };
    this.notes = this.notes.map((n) => (n.id === id ? updated : n));
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(this.notes));
    return updated;
  }

  public deleteNote(id: string): boolean {
    this.notes = this.notes.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(this.notes));
    return true;
  }

  // --- SCREENSHOTS METHODS ---
  public getScreenshots(): ScreenshotItem[] {
    return [...this.screenshots].sort((a, b) => b.timestamp - a.timestamp);
  }

  public addScreenshot(item: Omit<ScreenshotItem, 'id' | 'timestamp'>): ScreenshotItem {
    const newShot: ScreenshotItem = {
      ...item,
      id: `shot-${Date.now()}`,
      timestamp: Date.now(),
    };
    this.screenshots = [newShot, ...this.screenshots];
    localStorage.setItem(STORAGE_KEYS.SCREENSHOTS, JSON.stringify(this.screenshots));
    return newShot;
  }

  public deleteScreenshot(id: string): boolean {
    this.screenshots = this.screenshots.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCREENSHOTS, JSON.stringify(this.screenshots));
    return true;
  }

  // --- RECORDINGS METHODS ---
  public getRecordings(): RecordingItem[] {
    return [...this.recordings].sort((a, b) => b.timestamp - a.timestamp);
  }

  public addRecording(item: Omit<RecordingItem, 'id' | 'timestamp'>): RecordingItem {
    const newRec: RecordingItem = {
      ...item,
      id: `rec-${Date.now()}`,
      timestamp: Date.now(),
    };
    this.recordings = [newRec, ...this.recordings];
    localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(this.recordings));
    return newRec;
  }

  public deleteRecording(id: string): boolean {
    this.recordings = this.recordings.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(this.recordings));
    return true;
  }

  // --- APPS METHODS ---
  public getApps(): AppShortcutItem[] {
    return [...this.apps].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.order - b.order;
    });
  }

  public toggleAppFavorite(id: string): boolean {
    this.apps = this.apps.map((a) => (a.id === id ? { ...a, isFavorite: !a.isFavorite } : a));
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(this.apps));
    return true;
  }

  // --- PERMISSIONS METHODS ---
  public getPermissions(): PermissionStatus[] {
    return [...this.permissions];
  }

  public setPermissionGranted(id: PermissionId, isGranted: boolean) {
    this.permissions = this.permissions.map((p) => (p.id === id ? { ...p, isGranted } : p));
    localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(this.permissions));
  }
}

export const quickPanelStorage = new QuickPanelStorageService();
