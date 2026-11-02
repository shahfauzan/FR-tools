/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Master Type Definitions & Data Contracts
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import { ClipboardEntry, Collection, ClipboardSettings } from './clipboard';

export type ToolId = 
  | 'clipboard'
  | 'screenshot'
  | 'recorder'
  | 'flashlight'
  | 'volume'
  | 'calculator'
  | 'notes'
  | 'stopwatch'
  | 'qrscanner'
  | 'appshortcuts';

export interface ToolDefinition {
  id: ToolId;
  name: string;
  category: 'system' | 'media' | 'utility' | 'productivity';
  description: string;
  icon: string;
  enabled: boolean;
  order: number;
  badge?: string;
}

export interface FloatingPanelConfig {
  enabled: boolean;
  positionX: number; // percentage from left or px
  positionY: number; // percentage from top or px
  size: 'small' | 'medium' | 'large';
  opacity: number; // 20 - 100
  longPressShortcut: ToolId;
  hideWhenFullscreen: boolean;
}

export interface EdgePanelConfig {
  enabled: boolean;
  position: 'right' | 'left';
  width: number; // 280 - 420 px
  opacity: number; // 20 - 100
  triggerHeight: number; // px
  triggerOffset: number; // percentage from top
}

export type AccentTone = 'obsidian' | 'graphite' | 'carbon' | 'titanium' | 'silver';

export interface QuickPanelCustomization {
  theme: 'dark' | 'light' | 'system';
  accentTone: AccentTone;
  dashboardColumns: 2 | 3 | 4;
  iconStyle: 'minimal' | 'filled' | 'duotone';
  cardRadius: 'medium' | 'large' | 'full';
  hapticFeedback: boolean;
  floatingConfig: FloatingPanelConfig;
  edgeConfig: EdgePanelConfig;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  tags: string[];
}

export interface ScreenshotItem {
  id: string;
  filename: string;
  timestamp: number;
  dataUrl: string;
  width: number;
  height: number;
  sizeFormatted: string;
  category?: string;
}

export interface RecordingItem {
  id: string;
  filename: string;
  timestamp: number;
  durationSeconds: number;
  videoUrl?: string;
  sizeFormatted: string;
  resolution: string;
  isFavorite: boolean;
}

export interface StopwatchLap {
  lapNumber: number;
  lapTime: number; // ms
  overallTime: number; // ms
}

export interface AppShortcutItem {
  id: string;
  packageName: string;
  label: string;
  category: string;
  iconName: string;
  isFavorite: boolean;
  order: number;
}

export type PermissionId = 
  | 'SYSTEM_ALERT_WINDOW'
  | 'CAMERA'
  | 'RECORD_AUDIO'
  | 'POST_NOTIFICATIONS'
  | 'FOREGROUND_SERVICE'
  | 'WRITE_SETTINGS'
  | 'MEDIA_PROJECTION';

export interface PermissionStatus {
  id: PermissionId;
  name: string;
  description: string;
  requiredFor: string;
  isGranted: boolean;
  isCritical: boolean;
}
