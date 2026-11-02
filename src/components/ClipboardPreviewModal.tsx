/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Clipboard Entry Detailed Preview Modal
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { ClipboardEntry, Collection } from '../types/clipboard';
import { 
  X, 
  Copy, 
  Check, 
  Pin, 
  Heart, 
  Trash2, 
  Share2, 
  Edit3, 
  ExternalLink, 
  Mail, 
  Phone, 
  Code2, 
  ShieldCheck, 
  Folder,
  Tag,
  Database
} from 'lucide-react';

interface ClipboardPreviewModalProps {
  entry: ClipboardEntry | null;
  collection?: Collection;
  collections: Collection[];
  onClose: () => void;
  onCopy: (entry: ClipboardEntry) => void;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (entry: ClipboardEntry) => void;
  onMoveToCollection: (id: string, collectionId: string | null) => void;
  onShare: (entry: ClipboardEntry) => void;
}

export const ClipboardPreviewModal: React.FC<ClipboardPreviewModalProps> = ({
  entry,
  collection,
  collections,
  onClose,
  onCopy,
  onTogglePin,
  onToggleFavorite,
  onDelete,
  onEdit,
  onMoveToCollection,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);

  if (!entry) return null;

  const handleCopy = () => {
    onCopy(entry);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Clipboard Item Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                FR SHAH Room Database Entity · {entry.contentType.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Content Area */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span>Full Content Payload</span>
              <span className="tabular-nums font-mono text-[11px]">
                {entry.content.length} characters · {entry.content.split('\n').length} lines
              </span>
            </div>

            <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-sm text-slate-200 overflow-x-auto max-h-72 leading-relaxed selection:bg-indigo-500/40">
              <pre className="whitespace-pre-wrap break-words">{entry.content}</pre>
            </div>
          </div>

          {/* Contextual Safe Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {entry.contentType === 'url' && (
              <a
                href={entry.content.startsWith('http') ? entry.content : `https://${entry.content}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit URL in Browser</span>
              </a>
            )}

            {entry.contentType === 'email' && (
              <a
                href={`mailto:${entry.content}`}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
            )}

            {entry.contentType === 'phone' && (
              <a
                href={`tel:${entry.content.replace(/\s+/g, '')}`}
                className="px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900/60 text-xs font-semibold flex items-center gap-1.5 hover:bg-teal-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Phone Number</span>
              </a>
            )}

            <button
              onClick={() => onShare(entry)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share to App</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onEdit(entry);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Content</span>
            </button>
          </div>

          {/* Room Database Entity & Index Specifications */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Room SQLite Entity Inspection</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Key (id)</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{entry.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Index (contentHash)</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{entry.contentHash}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Created At</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {new Date(entry.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Last Updated / Copied</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {new Date(entry.updatedAt).toLocaleString()} ({entry.copyCount} uses)
                </span>
              </div>
            </div>

            {/* Collection Assignment Selector */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Collection Assignment
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => onMoveToCollection(entry.id, null)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                    !entry.collectionId
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  None
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => onMoveToCollection(entry.id, col.id)}
                    className={`px-3 py-1 text-xs rounded-lg border flex items-center gap-1.5 transition-colors ${
                      entry.collectionId === col.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags list */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTogglePin(entry.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                entry.isPinned
                  ? 'border-amber-500 text-amber-600 bg-amber-500/10'
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${entry.isPinned ? 'fill-amber-500' : ''}`} />
              <span>{entry.isPinned ? 'Pinned' : 'Pin to Top'}</span>
            </button>

            <button
              onClick={() => onToggleFavorite(entry.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                entry.isFavorite
                  ? 'border-pink-500 text-pink-600 bg-pink-500/10'
                  : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${entry.isFavorite ? 'fill-pink-500' : ''}`} />
              <span>{entry.isFavorite ? 'Favorited' : 'Favorite'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDelete(entry.id);
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to System' : 'Copy Again'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
