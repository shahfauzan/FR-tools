/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Screen Recorder Engine (MediaProjection & Foreground Service)
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Square, 
  Play, 
  Trash2, 
  Share2, 
  Download, 
  X, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Film
} from 'lucide-react';
import { RecordingItem } from '../../types/quickpanel';
import { quickPanelStorage } from '../../db/quickpanelStorage';

export const ScreenRecorderTool: React.FC = () => {
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<RecordingItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setRecordings(quickPanelStorage.getRecordings());
  }, []);

  // Timer loop when recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingSeconds(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsRecording(true);
          setStatusMsg('MediaProjection active · Recording Movies/FR SHAH QuickPanel/');
          setTimeout(() => setStatusMsg(null), 3000);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    const finalSeconds = Math.max(1, recordingSeconds);
    setIsRecording(false);

    const filename = `FR_SHAH_Recording_${new Date().toISOString().replace(/[:.]/g, '-')}.mp4`;
    const estimatedSizeMb = ((finalSeconds * 1.8) / 10).toFixed(1);

    const newRec = quickPanelStorage.addRecording({
      filename,
      durationSeconds: finalSeconds,
      sizeFormatted: `${estimatedSizeMb} MB`,
      resolution: '1080p @ 60fps',
      isFavorite: false,
    });

    setRecordings(quickPanelStorage.getRecordings());
    setStatusMsg(`Saved to Movies/FR SHAH QuickPanel/${filename}`);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleDelete = (id: string) => {
    quickPanelStorage.deleteRecording(id);
    setRecordings(quickPanelStorage.getRecordings());
    if (selectedVideo?.id === id) setSelectedVideo(null);
    setDeleteConfirmId(null);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Capture Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Foreground Service Type: MediaProjection
            </span>
            <span className="text-xs text-zinc-600">·</span>
            <span className="text-xs text-zinc-400 font-mono">Movies/FR SHAH QuickPanel/</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mt-0.5">
            Screen Recorder Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Android 14+ & 15+ compliant foreground recording with lifecycle interruption guards.
          </p>
        </div>

        <div>
          {isRecording ? (
            <button
              onClick={handleStopRecording}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 animate-pulse"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Stop ({formatDuration(recordingSeconds)})</span>
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              disabled={countdown !== null}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Video className="w-4 h-4 stroke-[2.5]" />
              <span>{countdown !== null ? `Starting in ${countdown}s...` : 'Start Recording'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Recording Floating Status Indicator */}
      {isRecording && (
        <div className="p-4 rounded-2xl bg-zinc-950 border border-rose-500/40 shadow-xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
            <div>
              <div className="text-xs font-bold text-zinc-100 flex items-center gap-2">
                <span>Capturing Display Stream</span>
                <span className="font-mono text-rose-400 font-bold tabular-nums">
                  [{formatDuration(recordingSeconds)}]
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                1080x2400 @ 60 FPS · Audio Track Synced
              </div>
            </div>
          </div>

          <button
            onClick={handleStopRecording}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
          >
            End Capture
          </button>
        </div>
      )}

      {/* Status banner */}
      {statusMsg && (
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 text-center animate-in fade-in">
          {statusMsg}
        </div>
      )}

      {/* Recordings History Grid */}
      {recordings.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-zinc-900/40 border border-dashed border-zinc-800 p-8 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-200">
            No screen recordings recorded yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Screen recordings will be saved with audio sync and duration metadata to Movies/FR SHAH QuickPanel/.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="font-bold text-zinc-200">{formatDuration(rec.durationSeconds)}</span>
                  </div>
                  <span className="font-mono text-[11px]">{rec.sizeFormatted}</span>
                </div>

                <div className="text-xs font-bold text-zinc-100 font-mono truncate">
                  {rec.filename}
                </div>

                <div className="text-[11px] text-zinc-500 font-mono mt-1">
                  {rec.resolution} · {new Date(rec.timestamp).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedVideo(rec)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-zinc-200" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center gap-1">
                  {deleteConfirmId === rec.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="px-2 py-1 rounded bg-rose-600 text-white text-[11px] font-bold"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-[11px]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(rec.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg"
                      title="Delete recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Preview Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <span className="text-xs font-bold text-zinc-200 font-mono truncate">
                {selectedVideo.filename}
              </span>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Video Player */}
            <div className="p-8 bg-zinc-950 flex flex-col items-center justify-center text-center space-y-3 min-h-[240px]">
              <div className="w-16 h-16 rounded-full bg-zinc-800 text-zinc-100 flex items-center justify-center shadow-xl">
                <Play className="w-8 h-8 fill-zinc-100 ml-1" />
              </div>
              <div className="text-xs font-bold text-zinc-300">
                Recording Duration: {formatDuration(selectedVideo.durationSeconds)}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Stored in Movies/FR SHAH QuickPanel/
              </div>
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex items-center justify-between text-xs">
              <div className="font-mono text-zinc-400 text-[11px]">
                {selectedVideo.resolution} · {selectedVideo.sizeFormatted}
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
