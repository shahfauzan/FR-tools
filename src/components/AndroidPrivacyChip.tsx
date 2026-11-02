/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Android 13+ Privacy Chip & Notification Overlay
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useEffect, useState } from 'react';
import { androidClipboard } from '../utils/clipboardManager';
import { Clipboard, ShieldCheck, AlertTriangle, X } from 'lucide-react';

interface ToastData {
  id: string;
  message: string;
  preview?: string;
  type: 'copy' | 'capture' | 'warning';
}

export const AndroidPrivacyChip: React.FC = () => {
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    const unsubscribe = androidClipboard.subscribePrivacyToast((data) => {
      const item: ToastData = {
        id: Math.random().toString(),
        message: data.message,
        preview: data.preview,
        type: data.type,
      };
      setToast(item);

      const timer = setTimeout(() => {
        setToast((current) => (current?.id === item.id ? null : current));
      }, 3500);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 pointer-events-auto">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-900/95 text-zinc-100 shadow-2xl border border-zinc-700/80 backdrop-blur-md max-w-md">
        <div className="p-1 rounded-full bg-zinc-800 text-zinc-300 shrink-0">
          {toast.type === 'copy' && <Clipboard className="w-4 h-4 text-zinc-200" />}
          {toast.type === 'capture' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
        </div>
        <div className="flex flex-col min-w-0 pr-1">
          <span className="text-xs font-semibold text-zinc-200 truncate">{toast.message}</span>
          {toast.preview && (
            <span className="text-[11px] text-zinc-400 truncate font-mono">
              {toast.preview}
            </span>
          )}
        </div>
        <button
          onClick={() => setToast(null)}
          className="text-zinc-400 hover:text-zinc-100 transition-colors p-1 rounded-full hover:bg-zinc-800"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
