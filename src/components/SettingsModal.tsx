/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Settings & Preferences Modal
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Sliders, 
  Trash2, 
  Save, 
  Database, 
  Lock, 
  Eye, 
  Smartphone,
  Info
} from 'lucide-react';
import { 
  ClipboardSettings, 
  HistoryCapacity, 
  RetentionPeriod, 
  SensitiveFilterAction, 
  CardAppearance 
} from '../types/clipboard';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ClipboardSettings;
  onSaveSettings: (settings: ClipboardSettings) => void;
  onWipeHistory: (preservePinned: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onWipeHistory,
}) => {
  const [localSettings, setLocalSettings] = useState<ClipboardSettings>(settings);
  const [activeTab, setActiveTab] = useState<'history' | 'privacy' | 'appearance' | 'about'>('history');
  const [confirmWipe, setConfirmWipe] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                FR SHAH Clipboard Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Android Room Database, Retention Policies & Privacy Guard
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            History & Capacity
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Privacy & Security
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'appearance'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Card Appearance
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            About & Credits
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Auto Capture Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Foreground Clipboard Auto-Capture
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Listens for new copied text when QuickPanel is in foreground focus.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.autoCapture}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, autoCapture: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* History Capacity */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  History Capacity Limit
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  When limit is reached, oldest non-pinned items are trimmed. Pinned items are strictly protected.
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {([100, 250, 500, 1000] as HistoryCapacity[]).map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() =>
                        setLocalSettings({ ...localSettings, historyCapacity: cap })
                      }
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        localSettings.historyCapacity === cap
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {cap} clips
                    </button>
                  ))}
                </div>
              </div>

              {/* Retention Policy */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  Automatic History Retention Period
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Non-pinned entries older than this timeframe will be automatically purged on startup.
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {(['1h', '24h', '7d', '30d', 'never'] as RetentionPeriod[]).map((ret) => (
                    <button
                      key={ret}
                      type="button"
                      onClick={() =>
                        setLocalSettings({ ...localSettings, retentionPeriod: ret })
                      }
                      className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition-all ${
                        localSettings.retentionPeriod === ret
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {ret === 'never' ? 'Never' : ret.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* Privacy Shield Info Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-indigo-900 dark:text-indigo-200">
                  <div className="font-bold text-sm mb-0.5">Zero-Server Clipboard Promise</div>
                  Clipboard data is never transmitted over network sockets or telemetry endpoints. All data remains exclusively inside your device's local Room SQLite database instance.
                </div>
              </div>

              {/* Sensitive Filter Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Filter Passwords & Sensitive Data
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Recognize 2FA OTP codes, API keys, passwords, and payment card numbers.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.filterSensitive}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, filterSensitive: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Sensitive Action Mode */}
              {localSettings.filterSensitive && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                    Sensitive Detection Behavior
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['warn', 'redact', 'block'] as SensitiveFilterAction[]).map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() =>
                          setLocalSettings({ ...localSettings, sensitiveAction: action })
                        }
                        className={`p-3 text-left rounded-xl border text-xs transition-all ${
                          localSettings.sensitiveAction === action
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-bold capitalize">{action}</div>
                        <div className="text-[10px] opacity-80 mt-1">
                          {action === 'warn' && 'Save with warning banner'}
                          {action === 'redact' && 'Mask content preview'}
                          {action === 'block' && 'Prevent automatic save'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Android 13 Privacy Chip toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Android 13+ Visual Privacy Pill
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Show bottom floating toast feedback whenever clipboard is accessed or copied.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.showAndroidPrivacyChip}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, showAndroidPrivacyChip: e.target.checked })
                  }
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Wipe history option */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                      Wipe Stored Room History
                    </div>
                    <div className="text-xs text-slate-500">
                      Instantly purge all historical clipboard rows from memory and storage.
                    </div>
                  </div>

                  {confirmWipe ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onWipeHistory(true);
                          setConfirmWipe(false);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-600 text-white"
                      >
                        Keep Pinned
                      </button>
                      <button
                        onClick={() => {
                          onWipeHistory(false);
                          setConfirmWipe(false);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-600 text-white"
                      >
                        Wipe All
                      </button>
                      <button
                        onClick={() => setConfirmWipe(false)}
                        className="px-2 py-1 text-xs rounded-lg border border-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmWipe(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-bold hover:bg-rose-100 transition-colors"
                    >
                      Purge DB
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Card Density */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  Clipboard Card Density
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'standard', 'detailed'] as CardAppearance['density'][]).map(
                    (d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() =>
                          setLocalSettings({
                            ...localSettings,
                            cardAppearance: { ...localSettings.cardAppearance, density: d },
                          })
                        }
                        className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                          localSettings.cardAppearance.density === d
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  Content Font Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sm', 'md', 'lg'] as CardAppearance['fontSize'][]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() =>
                        setLocalSettings({
                          ...localSettings,
                          cardAppearance: { ...localSettings.cardAppearance, fontSize: f },
                        })
                      }
                      className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition-all ${
                        localSettings.cardAppearance.fontSize === f
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {f === 'sm' ? 'Small' : f === 'md' ? 'Medium' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Appearance Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span>Show Relative Timestamps</span>
                  <input
                    type="checkbox"
                    checked={localSettings.cardAppearance.showTimestamp}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        cardAppearance: {
                          ...localSettings.cardAppearance,
                          showTimestamp: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span>Show Character & Word Counts</span>
                  <input
                    type="checkbox"
                    checked={localSettings.cardAppearance.showCharCount}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        cardAppearance: {
                          ...localSettings.cardAppearance,
                          showCharCount: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <span>Monospace Font for Code Snippets</span>
                  <input
                    type="checkbox"
                    checked={localSettings.cardAppearance.monospaceCode}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        cardAppearance: {
                          ...localSettings.cardAppearance,
                          monospaceCode: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-violet-900/20 border border-indigo-500/30 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg">
                  FR
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  FR SHAH SMART CLIPBOARD MANAGER
                </h3>
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  DEVELOPER CREDIT: MADE BY FR SHAH
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto pt-1 leading-relaxed">
                  Integrated into FR SHAH QuickPanel. Built with Android 10+ foreground gating, Android 13+ clipboard privacy specifications, local Room database persistence, and smart classification.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-slate-200">System Architecture</div>
                <div>• Android Room ORM Database schema v2.6.1</div>
                <div>• Indexed DJB2 content hashing for instantaneous deduplication</div>
                <div>• Smart auto-classifier for URLs, Emails, Phone Numbers & Code</div>
                <div>• 1-Click Multi-window Floating Widget and One UI Edge Panel</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-xs text-slate-400">
            MADE BY FR SHAH
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
