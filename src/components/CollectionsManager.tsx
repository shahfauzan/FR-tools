/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Collections Management & Organization Component
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { Collection, ClipboardEntry } from '../types/clipboard';
import { 
  FolderPlus, 
  Trash2, 
  Edit2, 
  BookOpen, 
  Code2, 
  Briefcase, 
  Languages, 
  Heart, 
  AlertCircle,
  Folder,
  X,
  Check
} from 'lucide-react';

interface CollectionsManagerProps {
  collections: Collection[];
  entries: ClipboardEntry[];
  onAddCollection: (collection: Omit<Collection, 'id' | 'createdAt'>) => void;
  onUpdateCollection: (id: string, updates: Partial<Collection>) => void;
  onDeleteCollection: (id: string) => void;
  onSelectCollectionFilter: (collectionId: string) => void;
}

const PRESET_COLORS = [
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#3B82F6', // Blue
];

const PRESET_ICONS = ['Folder', 'BookOpen', 'Code2', 'Briefcase', 'Languages', 'Heart', 'AlertCircle'];

export const CollectionsManager: React.FC<CollectionsManagerProps> = ({
  collections,
  entries,
  onAddCollection,
  onUpdateCollection,
  onDeleteCollection,
  onSelectCollectionFilter,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState(PRESET_ICONS[0]);

  const handleStartAdd = () => {
    setName('');
    setDescription('');
    setColor(PRESET_COLORS[0]);
    setIcon('Folder');
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (col: Collection) => {
    setEditingId(col.id);
    setName(col.name);
    setDescription(col.description);
    setColor(col.color);
    setIcon(col.icon);
    setIsAdding(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      onUpdateCollection(editingId, {
        name: name.trim(),
        description: description.trim(),
        color,
        icon,
      });
      setEditingId(null);
    } else {
      onAddCollection({
        name: name.trim(),
        description: description.trim(),
        color,
        icon,
      });
      setIsAdding(false);
    }
    setName('');
    setDescription('');
  };

  const renderIconComponent = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Languages':
        return <Languages className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'AlertCircle':
        return <AlertCircle className={className} />;
      default:
        return <Folder className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Clipboard Collections
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Group your copied items into categorized folders for instant reference.
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2 self-start"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      {/* Inline Create / Edit Drawer */}
      {(isAdding || editingId) && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {editingId ? 'Edit Collection' : 'Create New Collection'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Collection Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Study, Recipes, Work"
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Color & Icon Picker */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Theme Color
              </label>
              <div className="flex items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Icon
              </label>
              <div className="flex items-center gap-2">
                {PRESET_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setIcon(ic)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      icon === ic
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {renderIconComponent(ic, 'w-4 h-4')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              {editingId ? 'Update Collection' : 'Create Collection'}
            </button>
          </div>
        </form>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((col) => {
          const count = entries.filter((e) => e.collectionId === col.id).length;
          return (
            <div
              key={col.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: col.color }}
                  >
                    {renderIconComponent(col.icon)}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(col)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!col.isDefault && (
                      <button
                        onClick={() => onDeleteCollection(col.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {col.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {col.description || 'Custom collection'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-400">
                  {count} {count === 1 ? 'clip' : 'clips'}
                </span>

                <button
                  onClick={() => onSelectCollectionFilter(col.id)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  View Clips →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
