/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * New Clip / Manual Paste Creation Modal
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect } from 'react';
import { Collection, ContentType } from '../types/clipboard';
import { classifyContent, detectSensitive } from '../utils/classifier';
import { 
  X, 
  Plus, 
  ClipboardPaste, 
  AlertTriangle, 
  Link as LinkIcon, 
  Mail, 
  Phone, 
  Code2, 
  FileText,
  Pin,
  Tag
} from 'lucide-react';

interface NewClipModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  onSave: (
    content: string, 
    options?: { collectionId?: string | null; tags?: string[]; isPinned?: boolean; forceSaveSensitive?: boolean }
  ) => void;
}

export const NewClipModal: React.FC<NewClipModalProps> = ({
  isOpen,
  onClose,
  collections,
  onSave,
}) => {
  const [content, setContent] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [forceSensitive, setForceSensitive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setContent('');
      setSelectedCollection(null);
      setTags([]);
      setTagInput('');
      setIsPinned(false);
      setForceSensitive(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const classification = content.trim() ? classifyContent(content) : null;
  const sensitive = content.trim() ? detectSensitive(content) : null;

  const handlePasteFromDevice = async () => {
    try {
      if (navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) setContent(text);
      }
    } catch (e) {
      console.warn('Clipboard read failed:', e);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSave(content, {
      collectionId: selectedCollection,
      tags,
      isPinned,
      forceSaveSensitive: forceSensitive,
    });
    onClose();
  };

  const renderTypeIcon = (type?: ContentType) => {
    switch (type) {
      case 'url':
        return <LinkIcon className="w-3.5 h-3.5 text-blue-500" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-emerald-500" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5 text-teal-500" />;
      case 'code':
        return <Code2 className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create or Paste Clip
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manual entry into FR SHAH Room Database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Header Action to Paste from System */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Content Payload
            </label>
            <button
              type="button"
              onClick={handlePasteFromDevice}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste from System</span>
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type or paste text, links, code, email, phone number..."
            rows={5}
            required
            autoFocus
            className="w-full rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-none leading-relaxed"
          />

          {/* Real-time Content Classification */}
          {classification && (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <div className="flex items-center gap-1.5 font-medium">
                {renderTypeIcon(classification.contentType)}
                <span>Detected: {classification.contentType.toUpperCase()}</span>
                {classification.metadata.codeLanguage && (
                  <span>({classification.metadata.codeLanguage})</span>
                )}
                {classification.metadata.urlDomain && (
                  <span className="font-mono">({classification.metadata.urlDomain})</span>
                )}
              </div>
              <span className="tabular-nums font-mono text-[11px]">
                {content.length} characters
              </span>
            </div>
          )}

          {/* Sensitive Content Warning */}
          {sensitive && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-semibold">{sensitive.label} Detected</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-600 dark:text-amber-300">
                FR SHAH Security Filter detected credentials or passcodes. This will be stored locally in encrypted room database only.
              </p>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-amber-800 dark:text-amber-200">
                <input
                  type="checkbox"
                  checked={forceSensitive}
                  onChange={(e) => setForceSensitive(e.target.checked)}
                  className="rounded text-amber-600 border-amber-400 focus:ring-amber-500"
                />
                <span>Confirm save sensitive item to local history</span>
              </label>
            </div>
          )}

          {/* Collection Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Assign to Collection (Optional)
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCollection(null)}
                className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                  selectedCollection === null
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                None
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedCollection(col.id)}
                  className={`px-3 py-1 text-xs rounded-lg border flex items-center gap-1.5 transition-colors ${
                    selectedCollection === col.id
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

          {/* Tags Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Tags (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <Tag className="w-3.5 h-3.5 text-slate-400 ml-1" />
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs flex items-center gap-1"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? 'e.g. android, study, api' : 'Add more...'}
                className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Pin toggle */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
              />
              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
              <span>Pin this item (Preserves during automatic cleanup)</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-colors"
            >
              Save to History
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
