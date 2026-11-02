/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Quick Notes Module (Room Database Local Entity Persistence)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit3, 
  Tag, 
  X, 
  Check, 
  Clock,
  Save 
} from 'lucide-react';
import { NoteItem } from '../../types/quickpanel';
import { quickPanelStorage } from '../../db/quickpanelStorage';

export const QuickNotesTool: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setNotes(quickPanelStorage.getNotes());
  }, []);

  const reloadNotes = () => {
    setNotes(quickPanelStorage.getNotes());
  };

  const handleStartCreate = () => {
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
    setEditingNote(null);
    setIsCreating(true);
  };

  const handleStartEdit = (note: NoteItem) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setTagInput('');
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;

    if (editingNote) {
      quickPanelStorage.updateNote(editingNote.id, {
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        tags,
      });
      setEditingNote(null);
    } else {
      quickPanelStorage.saveNote(title, content, tags);
      setIsCreating(false);
    }

    reloadNotes();
  };

  const handleTogglePin = (id: string, currentPin: boolean) => {
    quickPanelStorage.updateNote(id, { isPinned: !currentPin });
    reloadNotes();
  };

  const handleDelete = (id: string) => {
    quickPanelStorage.deleteNote(id);
    if (editingNote?.id === id) setEditingNote(null);
    reloadNotes();
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

  const filteredNotes = notes.filter((n) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Room Database @Entity note_items
            </span>
            <span className="text-xs text-zinc-600">·</span>
            <span className="text-xs text-zinc-400">Zero Cloud · Local Sandbox</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mt-0.5">
            Quick Notes
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Lightweight, offline scratchpad with automatic saving and search indexing.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm transition-all flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Note</span>
        </button>
      </div>

      {/* Inline Create / Edit Drawer */}
      {(isCreating || editingNote) && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100">
              {editingNote ? 'Edit Note' : 'Create Quick Note'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingNote(null);
              }}
              className="p-1.5 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title..."
            className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm font-bold text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            rows={5}
            required
            className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 leading-relaxed resize-none"
          />

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
            <Tag className="w-3.5 h-3.5 text-zinc-500 ml-1" />
            {tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs flex items-center gap-1 font-mono"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  className="hover:text-rose-400"
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
              placeholder="Add tags (press Enter)..."
              className="flex-1 min-w-[140px] bg-transparent text-xs text-zinc-200 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingNote(null);
              }}
              className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingNote ? 'Save Changes' : 'Save Note'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes by title, content, or #tag..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
        />
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 p-8 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-200">
            {search ? 'No matching notes found' : 'No notes created yet'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Create your first quick note without requiring accounts or cloud synchronization.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`p-5 rounded-2xl bg-zinc-900 border transition-all flex flex-col justify-between space-y-3 ${
                note.isPinned
                  ? 'border-zinc-600 shadow-sm'
                  : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTogglePin(note.id, note.isPinned)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        note.isPinned
                          ? 'text-zinc-100 bg-zinc-800'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title={note.isPinned ? 'Unpin' : 'Pin note'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-zinc-100' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleStartEdit(note)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300"
                      title="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>

              {note.tags && note.tags.length > 0 && (
                <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap gap-1">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-zinc-950 text-[10px] font-mono text-zinc-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
