/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Room Database Table & Schema Inspector
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  HardDrive, 
  Layers, 
  Key, 
  Code2, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { roomDb } from '../db/roomDatabase';
import { ClipboardEntry, Collection } from '../types/clipboard';

interface RoomInspectorProps {
  entries: ClipboardEntry[];
  collections: Collection[];
  onRefresh: () => void;
  onWipe: (preservePinned: boolean) => void;
}

export const RoomInspector: React.FC<RoomInspectorProps> = ({
  entries,
  collections,
  onRefresh,
  onWipe,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const stats = roomDb.getDatabaseStats();

  const handleExportJson = () => {
    const json = roomDb.exportBackupJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fr_shah_room_clipboard_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyRawJson = () => {
    const json = roomDb.exportBackupJson();
    navigator.clipboard.writeText(json);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleImportJson = () => {
    if (!importText.trim()) return;
    try {
      const res = roomDb.importBackupJson(importText);
      alert(`Import complete: ${res.importedEntries} entries, ${res.importedCollections} collections.`);
      setImportText('');
      setShowImportBox(false);
      onRefresh();
    } catch (e: any) {
      alert(`Import error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Architecture Inspector
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{stats.roomVersion}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            Room Database Schema & Storage
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Local SQLite table entity representation with persistent indexing and zero telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleCopyRawJson}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copiedJson ? <Check className="w-4 h-4 text-emerald-500" /> : <Code2 className="w-4 h-4" />}
            <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* Import Drawer */}
      {showImportBox && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase">
            Import Room Backup JSON
          </h3>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste exported backup JSON here..."
            rows={4}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowImportBox(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleImportJson}
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Execute Import
            </button>
          </div>
        </div>
      )}

      {/* Room Table Metadata Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Primary Entity</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            @Entity clipboard_entries
          </div>
          <div className="text-xs text-slate-400 mt-1 tabular-nums">
            {stats.totalRows} records ({stats.pinnedCount} pinned, {stats.favoriteCount} favorited)
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Storage & Memory</span>
            <HardDrive className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            {stats.storageFormatted}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Local browser sandbox persistence
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Room Indices</span>
            <Key className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            5 Active Indices
          </div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            {stats.indices.join(', ')}
          </div>
        </div>
      </div>

      {/* Raw Table Rows View */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Table Entity Explorer ({entries.length} Rows)
          </h3>
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            title="Refresh Table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-3.5 py-2.5">ID (PK)</th>
                <th className="px-3.5 py-2.5">Type</th>
                <th className="px-3.5 py-2.5">Content Preview</th>
                <th className="px-3.5 py-2.5">Hash (Index)</th>
                <th className="px-3.5 py-2.5">Pinned</th>
                <th className="px-3.5 py-2.5">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {entries.slice(0, 15).map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-3.5 py-2 text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-[120px]">
                    {entry.id}
                  </td>
                  <td className="px-3.5 py-2 text-slate-600 dark:text-slate-300">
                    {entry.contentType}
                  </td>
                  <td className="px-3.5 py-2 text-slate-800 dark:text-slate-200 max-w-[280px] truncate">
                    {entry.content}
                  </td>
                  <td className="px-3.5 py-2 text-slate-400 truncate max-w-[100px]">
                    {entry.contentHash}
                  </td>
                  <td className="px-3.5 py-2">
                    {entry.isPinned ? (
                      <span className="text-amber-500 font-bold">TRUE</span>
                    ) : (
                      <span className="text-slate-400">false</span>
                    )}
                  </td>
                  <td className="px-3.5 py-2 text-slate-400 whitespace-nowrap">
                    {new Date(entry.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dangerous Operations / Wipe */}
      <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-rose-800 dark:text-rose-200">
            Wipe Room Database History
          </h3>
          <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-0.5">
            Completely purge stored clipboard entities from local room database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {confirmWipe ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onWipe(true);
                  setConfirmWipe(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Keep Pinned
              </button>
              <button
                onClick={() => {
                  onWipe(false);
                  setConfirmWipe(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Wipe All
              </button>
              <button
                onClick={() => setConfirmWipe(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmWipe(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Purge History</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
