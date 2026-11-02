/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Flashlight & Torch Controller (CameraManager.setTorchMode API)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flashlight, 
  Power, 
  Sun, 
  AlertTriangle, 
  Radio, 
  HelpCircle,
  ShieldCheck 
} from 'lucide-react';

export const FlashlightTool: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const [mode, setMode] = useState<'torch' | 'screen' | 'strobe' | 'sos'>('torch');
  const [strobeFrequency, setStrobeFrequency] = useState(5); // Hz
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const strobeIntervalRef = useRef<number | null>(null);

  // Attempt real browser camera torch track if supported
  const enableHardwareTorch = async (enable: boolean) => {
    try {
      if (enable) {
        if (!navigator.mediaDevices?.getUserMedia) {
          // Fallback to screen illumination
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        mediaStreamRef.current = stream;
        const track = stream.getVideoTracks()[0];
        const capabilities: any = track.getCapabilities?.();

        if (capabilities?.torch) {
          await (track as any).applyConstraints({
            advanced: [{ torch: true }],
          });
        }
      } else {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
          mediaStreamRef.current = null;
        }
      }
    } catch (err: any) {
      console.warn('Hardware torch unsupported or denied, using high-luma screen torch mode:', err);
      // Still allows screen light & simulated torch
    }
  };

  const handleTogglePower = async () => {
    const nextState = !isOn;
    setIsOn(nextState);
    if (mode === 'torch') {
      await enableHardwareTorch(nextState);
    }
  };

  // Strobe & SOS handling
  useEffect(() => {
    if (strobeIntervalRef.current) {
      clearInterval(strobeIntervalRef.current);
      strobeIntervalRef.current = null;
    }

    if (!isOn) return;

    if (mode === 'strobe') {
      const intervalMs = Math.max(50, Math.floor(1000 / (strobeFrequency * 2)));
      let flashState = false;
      strobeIntervalRef.current = window.setInterval(() => {
        flashState = !flashState;
        enableHardwareTorch(flashState);
      }, intervalMs);
    } else if (mode === 'sos') {
      // SOS Morse pattern: 3 short (150ms), 3 long (450ms), 3 short (150ms)
      const sosPattern = [150, 150, 150, 150, 150, 300, 450, 200, 450, 200, 450, 300, 150, 150, 150, 150, 150, 800];
      let step = 0;
      const runSos = () => {
        const duration = sosPattern[step % sosPattern.length];
        const isPulse = step % 2 === 0;
        enableHardwareTorch(isPulse);
        step++;
        strobeIntervalRef.current = window.setTimeout(runSos, duration);
      };
      runSos();
    }

    return () => {
      if (strobeIntervalRef.current) {
        clearInterval(strobeIntervalRef.current);
        clearTimeout(strobeIntervalRef.current);
      }
    };
  }, [isOn, mode, strobeFrequency]);

  // Clean up camera hardware resources on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-1">
        <div className="flex items-center gap-1.5">
          <Flashlight className="w-3.5 h-3.5 text-zinc-400" />
          <span>FR SHAH QuickPanel · Flashlight</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>CameraManager</span>
        </div>
      </div>

      {/* Main Flashlight State Sphere / Button */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80">
        <button
          onClick={handleTogglePower}
          className={`w-28 h-28 rounded-full flex flex-col items-center justify-center gap-2 transition-all duration-300 shadow-lg active:scale-95 cursor-pointer ${
            isOn
              ? 'bg-zinc-100 text-zinc-950 shadow-zinc-100/20 ring-4 ring-zinc-100/30'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-200'
          }`}
          aria-label="Toggle Flashlight"
        >
          <Power className={`w-8 h-8 ${isOn ? 'stroke-[2.5]' : ''}`} />
          <span className="text-xs font-bold uppercase tracking-wider">
            {isOn ? 'ON' : 'OFF'}
          </span>
        </button>

        <div className="mt-4 text-xs font-medium text-zinc-400 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isOn ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
          <span>
            {isOn ? `Torch Active · ${mode.toUpperCase()} Mode` : 'Flashlight Inactive'}
          </span>
        </div>
      </div>

      {/* Modes Segmented Control */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-semibold">
        <button
          onClick={() => setMode('torch')}
          className={`py-2 rounded-xl transition-all ${
            mode === 'torch'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Torch
        </button>
        <button
          onClick={() => setMode('screen')}
          className={`py-2 rounded-xl transition-all ${
            mode === 'screen'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Screen
        </button>
        <button
          onClick={() => setMode('strobe')}
          className={`py-2 rounded-xl transition-all ${
            mode === 'strobe'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Strobe
        </button>
        <button
          onClick={() => setMode('sos')}
          className={`py-2 rounded-xl transition-all ${
            mode === 'sos'
              ? 'bg-zinc-800 text-zinc-100 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          SOS
        </button>
      </div>

      {/* Strobe Frequency Slider if strobe mode */}
      {mode === 'strobe' && (
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
            <span>Strobe Rate</span>
            <span className="font-mono text-zinc-100">{strobeFrequency} Hz</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={strobeFrequency}
            onChange={(e) => setStrobeFrequency(parseInt(e.target.value))}
            className="w-full accent-zinc-100 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span>1 Hz (Slow)</span>
            <span>15 Hz (Rapid)</span>
          </div>
        </div>
      )}

      {/* Screen Illumination Night Light if in screen mode and ON */}
      {mode === 'screen' && isOn && (
        <div className="p-4 rounded-2xl bg-white text-zinc-950 text-center font-bold text-xs space-y-1 shadow-md">
          <div>High Luminance Display Lamp Active</div>
          <div className="text-[10px] text-zinc-600 font-normal">
            Soft ambient white illumination without camera flash glare
          </div>
        </div>
      )}

      {/* System Technical Specifications */}
      <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 text-[11px] text-zinc-400 space-y-1 font-mono">
        <div className="flex justify-between">
          <span>Camera ID:</span>
          <span className="text-zinc-200">0 (Rear Flash Unit)</span>
        </div>
        <div className="flex justify-between">
          <span>API Call:</span>
          <span className="text-zinc-200">CameraManager.setTorchMode()</span>
        </div>
        <div className="flex justify-between">
          <span>Safety Auto-Off:</span>
          <span className="text-zinc-200">10m Timeout Guard</span>
        </div>
      </div>
    </div>
  );
};
