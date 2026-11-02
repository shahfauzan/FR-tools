/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Material 3 Clipboard Item Card Component
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { 
  ClipboardEntry, 
  Collection, 
  CardAppearance 
} from '../types/clipboard';
import { 
  Copy, 
  Check, 
  Pin, 
  Heart, 
  Trash2, 
  Share2, 
  ExternalLink, 
  Eye, 
  Edit3, 
  FolderInput, 
  Link as LinkIcon, 
  Mail, 
  Phone, 
  Code2, 
  FileText, 
  MoreHorizontal,
  Lock,
  EyeOff
} from 'lucide-react';
import { maskSensitiveContent } from '../utils/classifier';

interface ClipboardCardProps {
  entry: ClipboardEntry;
  collection?: Collection;
  collections: Collection[];
  appearance: CardAppearance;
  isSelected: boolean;
  isMultiSelectMode: boolean;
  onToggleSelect: (id: string) => void;
  onCopy: (entry: ClipboardEntry) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (entry: ClipboardEntry) => void;
  onEdit: (entry: ClipboardEntry) => void;
  onMoveToCollection: (id: string, collectionId: string | null) => void;
  onShare: (entry: ClipboardEntry) => void;
}

export const ClipboardCard: React.FC<ClipboardCardProps> = ({
  entry,
  collection,
  collections,
  appearance,
  isSelected,
  isMultiSelectMode,
  onToggleSelect,
  onCopy,
  onTogglePin,
  onToggleFavorite,
  onDelete,
  onPreview,
  onEdit,
  onMoveToCollection,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [revealedSensitive, setRevealedSensitive] = useState(false);

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(entry);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Format relative timestamp
  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getContentTypeIcon = () => {
    switch (entry.contentType) {
      case 'url':
        return <LinkIcon className="w-3.5 h-3.5 text-blue-500" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-emerald-500" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5 text-teal-500" />;
      case 'code':
        return <Code2 className="w-3.5 h-3.5 text-amber-500" />;
      case 'other':
        return <FileText className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getContentTypeLabel = () => {
    switch (entry.contentType) {
      case 'url':
        return 'URL';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      case 'code':
        return entry.metadata?.codeLanguage ? `Code (${entry.metadata.codeLanguage})` : 'Code Snippet';
      case 'other':
        return 'Formatted Text';
      default:
        return 'Plain Text';
    }
  };

  // Determine display text (masking if sensitive and not revealed)
  const isSensitive = !!entry.detectedSensitive || entry.isRedacted;
  const displayText = isSensitive && !revealedSensitive 
    ? maskSensitiveContent(entry.content) 
    : entry.content;

  // Font size classes
  const fontSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }[appearance.fontSize];

  // Density spacing classes
  const paddingClass = {
    compact: 'p-3',
    standard: 'p-4',
    detailed: 'p-5',
  }[appearance.density];

  return (
    <div
      onClick={() => {
        if (isMultiSelectMode) {
          onToggleSelect(entry.id);
        } else {
          onPreview(entry);
        }
      }}
      className={`group relative rounded-2xl transition-all duration-200 cursor-pointer border ${
        isSelected
          ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm'
      } ${paddingClass}`}
    >
      {/* Top Metadata Header Row (Clean unboxed text with typographic separators) */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
          {isMultiSelectMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(entry.id)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer"
            />
          )}

          {appearance.showContentTypeBadge && (
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 shrink-0">
              {getContentTypeIcon()}
              <span>{getContentTypeLabel()}</span>
            </span>
          )}

          {collection && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span 
                className="font-medium truncate"
                style={{ color: collection.color }}
              >
                {collection.name}
              </span>
            </>
          )}

          {appearance.showTimestamp && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="shrink-0">{formatTime(entry.createdAt)}</span>
            </>
          )}

          {appearance.showCharCount && entry.metadata?.charCount && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="shrink-0 tabular-nums">{entry.metadata.charCount} chars</span>
            </>
          )}

          {entry.copyCount > 1 && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="shrink-0 tabular-nums">Used {entry.copyCount}x</span>
            </>
          )}
        </div>

        {/* Card Quick Action Buttons */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onTogglePin(entry.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              entry.isPinned
                ? 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={entry.isPinned ? 'Unpin from top' : 'Pin entry to top'}
            aria-label="Pin entry"
          >
            <Pin className={`w-3.5 h-3.5 ${entry.isPinned ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            onClick={() => onToggleFavorite(entry.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              entry.isFavorite
                ? 'text-pink-500 bg-pink-500/10 hover:bg-pink-500/20'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={entry.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Favorite entry"
          >
            <Heart className={`w-3.5 h-3.5 ${entry.isFavorite ? 'fill-pink-500' : ''}`} />
          </button>

          <button
            onClick={handleCopyClick}
            className={`p-1.5 rounded-lg transition-colors ${
              copied
                ? 'text-emerald-600 bg-emerald-500/15 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Copy to clipboard"
            aria-label="Copy"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="More options"
              aria-label="More options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onPreview(entry);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Preview</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(entry);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Clip</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onShare(entry);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Share Clip</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />

                {/* Move to collection sub-trigger */}
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Move Collection
                </div>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setShowMenu(false);
                      onMoveToCollection(entry.id, col.id);
                    }}
                    className={`w-full px-3 py-1 text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2 ${
                      entry.collectionId === col.id ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="truncate">{col.name}</span>
                  </button>
                ))}
                {entry.collectionId && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onMoveToCollection(entry.id, null);
                    }}
                    className="w-full px-3 py-1 text-xs text-left text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2 italic"
                  >
                    <FolderInput className="w-3 h-3" />
                    <span>Clear collection</span>
                  </button>
                )}

                <div className="border-t border-slate-100 dark:border-slate-700/80 my-1" />

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(entry.id);
                  }}
                  className="w-full px-3 py-1.5 text-xs text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sensitive Content Warning Bar if applicable */}
      {isSensitive && (
        <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-medium">
              {entry.detectedSensitive?.label || 'Sensitive Authentication / Secret Data'}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRevealedSensitive(!revealedSensitive);
            }}
            className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            {revealedSensitive ? (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Mask</span>
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span>Reveal</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Primary Content Preview */}
      <div className="relative">
        {entry.contentType === 'code' ? (
          <pre
            className={`${fontSizeClass} ${
              appearance.monospaceCode ? 'font-mono' : ''
            } p-3 rounded-xl bg-slate-900 text-slate-200 overflow-x-auto max-h-40 leading-relaxed`}
          >
            <code>{displayText}</code>
          </pre>
        ) : (
          <p
            className={`${fontSizeClass} text-slate-800 dark:text-slate-200 leading-relaxed line-clamp-4 break-words ${
              appearance.density === 'compact' ? 'line-clamp-2' : ''
            }`}
          >
            {displayText}
          </p>
        )}
      </div>

      {/* Safe Category Quick-Actions (URLs, Emails, Phones - NO AUTO EXECUTE) */}
      {entry.contentType === 'url' && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <a
            href={entry.content.startsWith('http') ? entry.content : `https://${entry.content}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open Link</span>
          </a>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500 truncate font-mono">
            {entry.metadata?.urlDomain || 'External Web'}
          </span>
        </div>
      )}

      {entry.contentType === 'email' && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <a
            href={`mailto:${entry.content}`}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Mail className="w-3 h-3" />
            <span>Draft Email</span>
          </a>
        </div>
      )}

      {entry.contentType === 'phone' && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <a
            href={`tel:${entry.content.replace(/\s+/g, '')}`}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            <span>Dial Number</span>
          </a>
        </div>
      )}

      {/* Tags Row */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          {entry.tags.map((tag) => (
            <span key={tag} className="hover:text-indigo-500 transition-colors">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
