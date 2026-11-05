/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Draggable Floating QuickPanel Button (WindowManager TYPE_APPLICATION_OVERLAY)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  AppWindow, 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight, 
  ClipboardList, 
  Camera, 
  Flashlight, 
  SlidersHorizontal,
  Calculator,
  Timer,
  BatteryCharging,
  Smartphone,
  QrCode
} from 'lucide-react';
import { FloatingPanelConfig, ToolId } from '../types/quickpanel';

interface FloatingQuickPanelButtonProps {
  config: FloatingPanelConfig;
  onUpdatePosition: (x: number, y: number) => void;
  onOpenQuickPanel: () => void;
  onTriggerShortcut: (toolId: ToolId) => void;
}

export const FloatingQuickPanelButton: React.FC<FloatingQuickPanelButtonProps> = ({
  config,
  onUpdatePosition,
  onOpenQuickPanel,
  onTriggerShortcut,
}) => {
  const [position, setPosition] = useState({ x: config.positionX, y: config.positionY });
  const [isDragging, setIsDragging] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: config.positionX,
    posY: config.positionY,
  });

  const pressTimerRef = useRef<number | null>(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    setPosition({ x: config.positionX, y: config.positionY });
  }, [config.positionX, config.positionY]);

  if (!config.enabled) return null;

  // Touch / Mouse Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    didDragRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };

    // Long press detection for shortcut
    pressTimerRef.current = window.setTimeout(() => {
      if (!didDragRef.current) {
        onTriggerShortcut(config.longPressShortcut);
      }
    }, 600);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.startX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;

      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        didDragRef.current = true;
        setIsDragging(true);
        if (pressTimerRef.current) {
          clearTimeout(pressTimerRef.current);
          pressTimerRef.current = null;
        }

        const newX = Math.max(5, Math.min(95, dragStartRef.current.posX + (deltaX / window.innerWidth) * 100));
        const newY = Math.max(5, Math.min(95, dragStartRef.current.posY + (deltaY / window.innerHeight) * 100));

        setPosition({ x: newX, y: newY });
      }
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
        pressTimerRef.current = null;
      }

      if (didDragRef.current) {
        setIsDragging(false);
        onUpdatePosition(position.x, position.y);
      } else {
        // Normal Tap -> toggle quick menu
        setShowQuickMenu((prev) => !prev);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Size styling
  const sizeClass = {
    small: 'w-11 h-11 text-xs',
    medium: 'w-14 h-14 text-sm',
    large: 'w-16 h-16 text-base',
  }[config.size];

  return (
    <>
      {/* Floating Button Element */}
      <div
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          opacity: config.opacity / 100,
        }}
        className={`fixed z-50 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing select-none transition-transform touch-none ${
          isDragging ? 'scale-105 shadow-2xl' : 'hover:scale-105 shadow-xl'
        }`}
        onPointerDown={handlePointerDown}
      >
        <div
          className={`${sizeClass} rounded-full bg-zinc-900 border-2 border-zinc-700/80 text-zinc-100 flex items-center justify-center shadow-2xl backdrop-blur-md group`}
        >
          <span className="font-black text-zinc-200 tracking-tighter">
            FR
          </span>
        </div>
      </div>

      {/* Floating Quick Action Radial / Popup Menu */}
      {showQuickMenu && (
        <div
          style={{
            left: `${Math.min(85, Math.max(15, position.x))}%`,
            top: `${Math.min(85, Math.max(15, position.y))}%`,
          }}
          className="fixed z-50 -translate-x-1/2 -translate-y-1/2 w-56 rounded-3xl bg-zinc-900/95 border border-zinc-800 shadow-2xl p-2 backdrop-blur-xl animate-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 text-xs font-bold text-zinc-300">
            <span>FR SHAH Floating Menu</span>
            <button
              onClick={() => setShowQuickMenu(false)}
              className="p-1 text-zinc-500 hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-1 space-y-1 text-xs">
            <button
              onClick={() => {
                setShowQuickMenu(false);
                onTriggerShortcut('battery');
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-zinc-800 text-zinc-100 flex items-center justify-between transition-colors bg-zinc-800/40"
            >
              <div className="flex items-center gap-2.5">
                <BatteryCharging className="w-4 h-4 text-zinc-200" />
                <span className="font-semibold">Battery Health & Power</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">Live</span>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onTriggerShortcut('clipboard');
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-zinc-800 text-zinc-200 flex items-center gap-2.5 transition-colors"
            >
              <ClipboardList className="w-4 h-4 text-zinc-400" />
              <span>Smart Clipboard</span>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onTriggerShortcut('qrgenerator');
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-zinc-800 text-zinc-200 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <QrCode className="w-4 h-4 text-zinc-300" />
                <span>QR Generator</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">New</span>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onTriggerShortcut('screenshot');
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-zinc-800 text-zinc-200 flex items-center gap-2.5 transition-colors"
            >
              <Camera className="w-4 h-4 text-zinc-400" />
              <span>Take Screenshot</span>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onTriggerShortcut('flashlight');
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-zinc-800 text-zinc-200 flex items-center gap-2.5 transition-colors"
            >
              <Flashlight className="w-4 h-4 text-zinc-400" />
              <span>Toggle Flashlight</span>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onTriggerShortcut('calculator');
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-zinc-800 text-zinc-200 flex items-center gap-2.5 transition-colors"
            >
              <Calculator className="w-4 h-4 text-zinc-400" />
              <span>Calculator</span>
            </button>

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onTriggerShortcut('stopwatch');
              }}
              className="w-full px-3 py-2 rounded-xl text-left hover:bg-zinc-800 text-zinc-200 flex items-center gap-2.5 transition-colors"
            >
              <Timer className="w-4 h-4 text-zinc-400" />
              <span>Stopwatch</span>
            </button>

            <div className="border-t border-zinc-800 my-1" />

            <button
              onClick={() => {
                setShowQuickMenu(false);
                onOpenQuickPanel();
              }}
              className="w-full px-3 py-2 rounded-xl text-left font-bold text-zinc-100 bg-zinc-800 hover:bg-zinc-700 flex items-center justify-between"
            >
              <span>Full QuickPanel</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
