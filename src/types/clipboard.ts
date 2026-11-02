/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Type Definitions & Data Contracts
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

export type ContentType = 
  | 'plain_text' 
  | 'url' 
  | 'email' 
  | 'phone' 
  | 'code' 
  | 'other';

export interface ClipboardEntry {
  id: string;
  content: string;
  contentType: ContentType;
  createdAt: number;
  updatedAt: number;
  isPinned: boolean;
  isFavorite: boolean;
  collectionId: string | null;
  contentHash: string;
  tags: string[];
  copyCount: number;
  isRedacted?: boolean;
  detectedSensitive?: {
    type: 'otp' | 'password' | 'api_key' | 'credit_card' | 'jwt_token';
    label: string;
  };
  metadata?: {
    charCount: number;
    wordCount: number;
    lineCount: number;
    codeLanguage?: string;
    urlDomain?: string;
  };
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: number;
  isDefault?: boolean;
}

export type HistoryCapacity = 100 | 250 | 500 | 1000;

export type RetentionPeriod = '1h' | '24h' | '7d' | '30d' | 'never';

export type SensitiveFilterAction = 'block' | 'redact' | 'warn';

export interface CardAppearance {
  density: 'compact' | 'standard' | 'detailed';
  fontSize: 'sm' | 'md' | 'lg';
  showTimestamp: boolean;
  showCharCount: boolean;
  showContentTypeBadge: boolean;
  monospaceCode: boolean;
}

export interface ClipboardSettings {
  autoCapture: boolean;
  historyCapacity: HistoryCapacity;
  retentionPeriod: RetentionPeriod;
  filterSensitive: boolean;
  sensitiveAction: SensitiveFilterAction;
  cardAppearance: CardAppearance;
  theme: 'dark' | 'light' | 'system';
  edgePanelPosition: 'right' | 'left';
  edgePanelWidth: number;
  showAndroidPrivacyChip: boolean;
  confirmBeforeWipe: boolean;
}

export type SortOption = 
  | 'newest' 
  | 'oldest' 
  | 'alphabetical' 
  | 'most_copied';

export interface FilterState {
  searchQuery: string;
  contentType: ContentType | 'all';
  collectionId: string | 'all';
  tag: string | 'all';
  onlyPinned: boolean;
  onlyFavorites: boolean;
  sortBy: SortOption;
}
