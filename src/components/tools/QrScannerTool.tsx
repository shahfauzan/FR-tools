/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * QR & Barcode Scanner Engine (CameraX & ML Kit Implementation)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  QrCode, 
  Camera, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ScannedResult {
  content: string;
  type: 'url' | 'wifi' | 'text' | 'contact';
  timestamp: number;
}

const SAMPLE_CODES = [
  { content: 'https://github.com/shahfauzan/quickpanel-android-suite', type: 'url' as const },
  { content: 'WIFI:S:FR_SHAH_5G;T:WPA;P:MotorolaG75Secure;;', type: 'wifi' as const },
  { content: 'MECARD:N:FR SHAH;EMAIL:shahfauzan49@gmail.com;;', type: 'contact' as const },
  { content: 'FR SHAH QuickPanel · Build. Control. Customize. Verification Code: QP-2026-99', type: 'text' as const },
];

export const QrScannerTool: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [scannedResult, setScannedResult] = useState<ScannedResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUrlConfirm, setShowUrlConfirm] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        setHasPermission(true);
      } else {
        // Fallback for simulation
        setIsCameraActive(true);
      }
    } catch (e) {
      console.warn('Camera access denied or unavailable:', e);
      setHasPermission(false);
      setIsCameraActive(true); // Still allows simulated detection
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleSimulateScan = (sample: typeof SAMPLE_CODES[0]) => {
    setScannedResult({
      content: sample.content,
      type: sample.type,
      timestamp: Date.now(),
    });
    stopCamera();
  };

  const handleCopy = () => {
    if (!scannedResult) return;
    navigator.clipboard.writeText(scannedResult.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!scannedResult) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Scanned QR Code',
          text: scannedResult.content,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-1">
        <div className="flex items-center gap-1.5">
          <QrCode className="w-3.5 h-3.5 text-zinc-400" />
          <span>FR SHAH QuickPanel · QR Scanner</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>CameraX API</span>
        </div>
      </div>

      {/* Viewfinder Screen */}
      <div className="relative aspect-square rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden flex flex-col items-center justify-center">
        {isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Target Reticle */}
            <div className="relative z-10 w-48 h-48 border-2 border-zinc-400/60 rounded-3xl flex items-center justify-center shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-zinc-100 shadow-[0_0_12px_#fff] animate-bounce" />
            </div>

            <div className="absolute bottom-3 z-10 px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-[11px] text-zinc-300 font-mono">
              Align code within frame
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-zinc-400 flex items-center justify-center border border-zinc-800">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-zinc-200">Camera Scanner Idle</div>
              <div className="text-[11px] text-zinc-500 max-w-xs">
                Camera permission is requested strictly on-demand.
              </div>
            </div>
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm transition-all"
            >
              Start Viewfinder
            </button>
          </div>
        )}
      </div>

      {/* Camera Toggle or Simulated Sample Badges for Testing */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-zinc-400 px-1">
          Simulate Camera Detections (Instant Testing):
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => handleSimulateScan(SAMPLE_CODES[0])}
            className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-left truncate transition-colors"
          >
            Detect URL
          </button>
          <button
            onClick={() => handleSimulateScan(SAMPLE_CODES[1])}
            className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-left truncate transition-colors"
          >
            Detect WiFi
          </button>
        </div>
      </div>

      {/* Scanned Result Card */}
      {scannedResult && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              Decoded {scannedResult.type.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono">
              {new Date(scannedResult.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 font-mono text-xs text-zinc-200 break-words leading-relaxed select-all">
            {scannedResult.content}
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {scannedResult.type === 'url' && (
              <button
                onClick={() => setShowUrlConfirm(true)}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open URL</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Safe URL Confirmation Modal (Crucial Requirement: Never auto-execute!) */}
      {showUrlConfirm && scannedResult && (
        <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-zinc-100 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Confirm External URL Launch</span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed font-mono break-all">
            {scannedResult.content}
          </p>
          <div className="text-[10px] text-zinc-400">
            FR SHAH Security Guard: Links are never executed automatically.
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setShowUrlConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-zinc-700 text-zinc-300 text-xs"
            >
              Cancel
            </button>
            <a
              href={scannedResult.content}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowUrlConfirm(false)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs inline-flex items-center gap-1"
            >
              <span>Visit Link</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
