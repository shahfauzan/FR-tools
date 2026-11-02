/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Volume & Brightness Control Panel (AudioManager & WindowManager APIs)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff, 
  Sun, 
  Moon, 
  SlidersHorizontal, 
  ExternalLink,
  ShieldAlert,
  Check
} from 'lucide-react';

export const VolumeBrightnessTool: React.FC = () => {
  const [mediaVolume, setMediaVolume] = useState(70);
  const [ringVolume, setRingVolume] = useState(85);
  const [windowBrightness, setWindowBrightness] = useState(80);
  const [systemBrightness, setSystemBrightness] = useState(65);
  const [isMediaMuted, setIsMediaMuted] = useState(false);
  const [isRingSilent, setIsRingSilent] = useState(false);
  const [hasWriteSettings, setHasWriteSettings] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [activeShortcutNotice, setActiveShortcutNotice] = useState<string | null>(null);

  const handleMediaMuteToggle = () => {
    setIsMediaMuted(!isMediaMuted);
  };

  const handleRingSilentToggle = () => {
    setIsRingSilent(!isRingSilent);
  };

  const handleTriggerShortcut = (name: string) => {
    setActiveShortcutNotice(`Opened: android.settings.${name}`);
    setTimeout(() => setActiveShortcutNotice(null), 2500);
  };

  const handleGrantWriteSettings = () => {
    setHasWriteSettings(true);
    setShowPermissionPrompt(false);
    setActiveShortcutNotice('WRITE_SETTINGS permission granted');
    setTimeout(() => setActiveShortcutNotice(null), 2500);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-1">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
          <span>FR SHAH QuickPanel · Sliders</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">AudioManager</span>
      </div>

      {/* Notification Toast if shortcut clicked */}
      {activeShortcutNotice && (
        <div className="p-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 text-center animate-in fade-in">
          {activeShortcutNotice}
        </div>
      )}

      {/* 1. Media Volume */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleMediaMuteToggle}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
              title={isMediaMuted ? 'Unmute Media' : 'Mute Media'}
            >
              {isMediaMuted || mediaVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-zinc-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-zinc-200" />
              )}
            </button>
            <span className="text-xs font-bold text-zinc-200">Media Volume</span>
          </div>
          <span className="text-xs font-mono text-zinc-400 tabular-nums">
            {isMediaMuted ? 'Muted' : `${mediaVolume}%`}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={isMediaMuted ? 0 : mediaVolume}
          onChange={(e) => {
            setMediaVolume(parseInt(e.target.value));
            if (isMediaMuted) setIsMediaMuted(false);
          }}
          className="w-full accent-zinc-100 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>0 (Silent)</span>
          <span>50</span>
          <span>100 (Max)</span>
        </div>
      </div>

      {/* 2. Ring & Notifications Volume */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRingSilentToggle}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
              title={isRingSilent ? 'Ring On' : 'Silent Mode'}
            >
              {isRingSilent ? (
                <BellOff className="w-4 h-4 text-zinc-400" />
              ) : (
                <Bell className="w-4 h-4 text-zinc-200" />
              )}
            </button>
            <span className="text-xs font-bold text-zinc-200">Ring & Notifications</span>
          </div>
          <span className="text-xs font-mono text-zinc-400 tabular-nums">
            {isRingSilent ? 'Silent' : `${ringVolume}%`}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={isRingSilent ? 0 : ringVolume}
          onChange={(e) => {
            setRingVolume(parseInt(e.target.value));
            if (isRingSilent) setIsRingSilent(false);
          }}
          className="w-full accent-zinc-100 cursor-pointer"
        />
      </div>

      {/* 3. Window & Screen Brightness */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
              <Sun className="w-4 h-4 text-zinc-200" />
            </div>
            <span className="text-xs font-bold text-zinc-200">Window Brightness</span>
          </div>
          <span className="text-xs font-mono text-zinc-400 tabular-nums">
            {windowBrightness}%
          </span>
        </div>

        <input
          type="range"
          min="10"
          max="100"
          value={windowBrightness}
          onChange={(e) => setWindowBrightness(parseInt(e.target.value))}
          className="w-full accent-zinc-100 cursor-pointer"
        />

        {/* Global System Brightness Button with Permission rationale */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
          <span className="text-zinc-400">System Brightness</span>
          {hasWriteSettings ? (
            <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
              <Check className="w-3 h-3" />
              <span>WRITE_SETTINGS Granted</span>
            </span>
          ) : (
            <button
              onClick={() => setShowPermissionPrompt(true)}
              className="text-zinc-300 hover:text-white underline text-[11px] font-semibold"
            >
              Request WRITE_SETTINGS
            </button>
          )}
        </div>
      </div>

      {/* Permission Explanation Modal/Card if toggled */}
      {showPermissionPrompt && (
        <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-zinc-100 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Android WRITE_SETTINGS Permission</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Changing device-wide system brightness requires Android Special App Access (`android.permission.WRITE_SETTINGS`). Ordinary applications can adjust window brightness directly without special privileges.
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setShowPermissionPrompt(false)}
              className="px-3 py-1 rounded-lg bg-zinc-700 text-zinc-300 text-xs"
            >
              Dismiss
            </button>
            <button
              onClick={handleGrantWriteSettings}
              className="px-3 py-1 rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs"
            >
              Grant Access
            </button>
          </div>
        </div>
      )}

      {/* System Settings Shortcuts */}
      <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
        <button
          onClick={() => handleTriggerShortcut('SOUND_SETTINGS')}
          className="p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-all flex items-center justify-between"
        >
          <span>Sound Settings</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
        </button>

        <button
          onClick={() => handleTriggerShortcut('DISPLAY_SETTINGS')}
          className="p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-all flex items-center justify-between"
        >
          <span>Display Settings</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
        </button>
      </div>
    </div>
  );
};
