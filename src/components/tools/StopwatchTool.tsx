/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Precision Stopwatch & Lap Tracking Engine
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flag, 
  Timer, 
  Clock 
} from 'lucide-react';
import { StopwatchLap } from '../../types/quickpanel';

export const StopwatchTool: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [laps, setLaps] = useState<StopwatchLap[]>([]);

  // SystemClock.elapsedRealtime equivalent using performance.now()
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const updateTimer = () => {
    const current = performance.now();
    const total = accumulatedTimeRef.current + (current - startTimeRef.current);
    setElapsedTime(total);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  };

  const handleStart = () => {
    startTimeRef.current = performance.now();
    setIsRunning(true);
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  };

  const handlePause = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    accumulatedTimeRef.current += performance.now() - startTimeRef.current;
    setElapsedTime(accumulatedTimeRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsRunning(false);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
    setElapsedTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    const previousOverall = laps.length > 0 ? laps[0].overallTime : 0;
    const lapTime = elapsedTime - previousOverall;
    const newLap: StopwatchLap = {
      lapNumber: laps.length + 1,
      lapTime,
      overallTime: elapsedTime,
    };
    setLaps([newLap, ...laps]);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Format time: MM:SS.mmm
  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor(ms % 1000);
    return {
      mins: mins.toString().padStart(2, '0'),
      secs: secs.toString().padStart(2, '0'),
      millis: millis.toString().padStart(3, '0'),
    };
  };

  const { mins, secs, millis } = formatTime(elapsedTime);

  // Best and worst laps
  const lapTimes = laps.map((l) => l.lapTime);
  const fastestLap = lapTimes.length > 1 ? Math.min(...lapTimes) : null;
  const slowestLap = lapTimes.length > 1 ? Math.max(...lapTimes) : null;

  return (
    <div className="w-full max-w-sm mx-auto p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-1">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>FR SHAH QuickPanel · Stopwatch</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">elapsedRealtime</span>
      </div>

      {/* High-Precision Digital Time Display */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-center font-mono select-none">
        <div className="flex items-baseline justify-center gap-1 text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 tabular-nums">
          <span>{mins}</span>
          <span className="text-zinc-500">:</span>
          <span>{secs}</span>
          <span className="text-zinc-600 text-2xl sm:text-3xl">.{millis}</span>
        </div>
        <div className="text-[11px] text-zinc-500 mt-2">
          {isRunning ? 'Timer active' : elapsedTime > 0 ? 'Paused' : 'Ready'}
        </div>
      </div>

      {/* Control Buttons (Black & Grey Aesthetic) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleReset}
          disabled={elapsedTime === 0}
          className="h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
        >
          <Flag className="w-4 h-4" />
          <span>Lap</span>
        </button>

        {isRunning ? (
          <button
            onClick={handlePause}
            className="h-12 rounded-2xl bg-zinc-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Pause className="w-4 h-4 fill-zinc-950" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="h-12 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
          >
            <Play className="w-4 h-4 fill-zinc-950" />
            <span>Start</span>
          </button>
        )}
      </div>

      {/* Laps List */}
      {laps.length > 0 && (
        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 max-h-48 overflow-y-auto space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-[11px] text-zinc-500 border-b border-zinc-800 pb-1.5 px-1 font-sans">
            <span>Lap No.</span>
            <span>Lap Split</span>
            <span>Overall Time</span>
          </div>
          {laps.map((lap) => {
            const split = formatTime(lap.lapTime);
            const total = formatTime(lap.overallTime);
            const isFastest = fastestLap !== null && lap.lapTime === fastestLap;
            const isSlowest = slowestLap !== null && lap.lapTime === slowestLap;

            return (
              <div
                key={lap.lapNumber}
                className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                  isFastest
                    ? 'bg-emerald-950/30 text-emerald-300 font-semibold border border-emerald-900/40'
                    : isSlowest
                    ? 'bg-rose-950/30 text-rose-300 border border-rose-900/40'
                    : 'hover:bg-zinc-900 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">#{lap.lapNumber}</span>
                  {isFastest && <span className="text-[10px] text-emerald-400 uppercase font-sans">Best</span>}
                  {isSlowest && <span className="text-[10px] text-rose-400 uppercase font-sans">Slow</span>}
                </div>
                <span>+{split.mins}:{split.secs}.{split.millis}</span>
                <span className="font-bold text-zinc-200">{total.mins}:{total.secs}.{total.millis}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
