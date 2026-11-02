/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Centralized Permission & Security Access Manager
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Camera, 
  AppWindow, 
  Bell, 
  SlidersHorizontal, 
  Video, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { PermissionStatus, PermissionId } from '../types/quickpanel';

interface PermissionsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: PermissionStatus[];
  onTogglePermission: (id: PermissionId, granted: boolean) => void;
}

export const PermissionsManagerModal: React.FC<PermissionsManagerModalProps> = ({
  isOpen,
  onClose,
  permissions,
  onTogglePermission,
}) => {
  if (!isOpen) return null;

  const getPermissionIcon = (id: PermissionId) => {
    switch (id) {
      case 'SYSTEM_ALERT_WINDOW':
        return <AppWindow className="w-4 h-4 text-zinc-300" />;
      case 'CAMERA':
        return <Camera className="w-4 h-4 text-zinc-300" />;
      case 'FOREGROUND_SERVICE':
      case 'MEDIA_PROJECTION':
        return <Video className="w-4 h-4 text-zinc-300" />;
      case 'POST_NOTIFICATIONS':
        return <Bell className="w-4 h-4 text-zinc-300" />;
      case 'WRITE_SETTINGS':
        return <SlidersHorizontal className="w-4 h-4 text-zinc-300" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-zinc-300" />;
    }
  };

  const grantedCount = permissions.filter((p) => p.isGranted).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-zinc-800 text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">
                Android Permissions & Security
              </h2>
              <p className="text-xs text-zinc-400">
                Granular Android 10 - 16 Permission Auditing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Overview Card */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-200">System Security Compliance</span>
              <span className="font-mono text-zinc-400 tabular-nums">
                {grantedCount} / {permissions.length} Authorized
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-zinc-100 h-full rounded-full transition-all duration-300"
                style={{ width: `${(grantedCount / permissions.length) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed pt-1">
              FR SHAH QuickPanel never uses root access, never bypasses Android security dialogs, and requests permissions strictly on-demand.
            </p>
          </div>

          {/* Permissions List */}
          <div className="space-y-3">
            {permissions.map((perm) => (
              <div
                key={perm.id}
                className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 mt-0.5">
                    {getPermissionIcon(perm.id)}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-200">
                        {perm.name}
                      </span>
                      {perm.isCritical && (
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          Core
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 leading-relaxed">
                      {perm.description}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Target feature: {perm.requiredFor}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  <input
                    type="checkbox"
                    checked={perm.isGranted}
                    onChange={(e) => onTogglePermission(perm.id, e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-100 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/60">
          <span className="text-[11px] text-zinc-500 font-mono">
            Moto G75 5G · Android 16 Compatible
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-zinc-950 bg-zinc-100 hover:bg-white rounded-xl shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
