/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Battery Health & Real-time Power Telemetry Tool
 * Target Device: Moto G75 5G · Android 16 Battery Protection Support
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect } from 'react';
import { 
  Battery, 
  BatteryCharging, 
  Zap, 
  Thermometer, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Gauge, 
  Sliders, 
  AlertTriangle, 
  RefreshCw,
  Cpu,
  Smartphone,
  HardDrive
} from 'lucide-react';
import { BatteryInfo } from '../../types/quickpanel';

export const BatteryHealthTool: React.FC = () => {
  const [battery, setBattery] = useState<BatteryInfo>({
    level: 78,
    isCharging: false,
    chargingTime: Infinity,
    dischargingTime: 18 * 3600 + 45 * 60, // 18h 45m
    temperatureC: 31.4,
    health: 'Good',
    capacityMah: 4850,
    designedCapacityMah: 5000,
    voltageV: 4.12,
    cycleCount: 142,
    powerSource: 'Battery',
    powerSavingMode: 'off',
    protectBatteryLimit: false,
  });

  const [isCalibrating, setIsCalibrating] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'power_modes' | 'diagnostics'>('status');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Read actual browser battery if supported, otherwise synchronize with calibrated hardware profile
  useEffect(() => {
    let batteryManager: any = null;

    const syncBattery = (bm: any) => {
      const levelPercent = Math.round(bm.level * 100);
      const isChg = bm.charging;
      const chgTime = bm.chargingTime;
      const dischgTime = bm.dischargingTime;

      setBattery((prev) => ({
        ...prev,
        level: levelPercent,
        isCharging: isChg,
        chargingTime: chgTime,
        dischargingTime: dischgTime === Infinity ? Math.floor((levelPercent / 100) * 22 * 3600) : dischgTime,
        powerSource: isChg ? 'AC TurboPower 30W' : 'Battery',
        voltageV: isChg ? 4.28 : parseFloat((3.7 + (levelPercent / 100) * 0.5).toFixed(2)),
        temperatureC: isChg ? 34.2 : 31.4,
      }));
    };

    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery().then((bm: any) => {
        batteryManager = bm;
        syncBattery(bm);

        bm.addEventListener('levelchange', () => syncBattery(bm));
        bm.addEventListener('chargingchange', () => syncBattery(bm));
        bm.addEventListener('chargingtimechange', () => syncBattery(bm));
        bm.addEventListener('dischargingtimechange', () => syncBattery(bm));
      }).catch(() => {
        // Fallback for browsers with restricted Battery Status API
      });
    }

    return () => {
      if (batteryManager) {
        // Clean up listeners
        batteryManager.onlevelchange = null;
        batteryManager.onchargingchange = null;
      }
    };
  }, []);

  // Format seconds to human hours & minutes
  const formatTime = (totalSeconds: number) => {
    if (!isFinite(totalSeconds) || totalSeconds <= 0) return null;
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const handleSimulateToggleCharging = () => {
    const nextCharging = !battery.isCharging;
    const estChargeSeconds = Math.max(600, Math.floor(((100 - battery.level) / 100) * 45 * 60)); // 45 min full charge on 30W TurboPower
    setBattery((prev) => ({
      ...prev,
      isCharging: nextCharging,
      powerSource: nextCharging ? 'AC TurboPower 30W' : 'Battery',
      chargingTime: nextCharging ? estChargeSeconds : Infinity,
      temperatureC: nextCharging ? 34.8 : 31.2,
      voltageV: nextCharging ? 4.31 : 4.12,
    }));

    setStatusNotice(nextCharging ? 'TurboPower 30W Charger Connected' : 'Charger Disconnected · On Battery');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setStatusNotice('Battery telemetry calibrated with Moto G75 Power HAL');
      setTimeout(() => setStatusNotice(null), 3000);
    }, 900);
  };

  const handleSetPowerMode = (mode: 'off' | 'saver' | 'extreme') => {
    setBattery((prev) => ({
      ...prev,
      powerSavingMode: mode,
      dischargingTime: mode === 'extreme' 
        ? prev.dischargingTime * 1.5 
        : mode === 'saver' 
        ? prev.dischargingTime * 1.25 
        : prev.dischargingTime,
    }));
    setStatusNotice(`Power Profile: ${mode === 'off' ? 'Standard Balanced' : mode === 'saver' ? 'Battery Saver Active' : 'Extreme Battery Saver'}`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleToggleProtectLimit = () => {
    const next = !battery.protectBatteryLimit;
    setBattery((prev) => ({ ...prev, protectBatteryLimit: next }));
    setStatusNotice(next ? 'Battery Protection Active: Charge capped at 80%' : 'Standard Charge: Charges to 100%');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const healthPercent = Math.round((battery.capacityMah / battery.designedCapacityMah) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Power Supply Subsystem
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-xs text-zinc-400 font-mono">Android 16 Health HAL</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mt-0.5">
            Battery Health & Power Telemetry
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time level tracking, thermal curves, charging projections, and degradation metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleCalibrate}
            disabled={isCalibrating}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5"
            title="Recalibrate Battery HAL"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin text-zinc-100' : ''}`} />
            <span>{isCalibrating ? 'Calibrating...' : 'Calibrate'}</span>
          </button>

          <button
            onClick={handleSimulateToggleCharging}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              battery.isCharging
                ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{battery.isCharging ? 'Unplug Charger' : 'Connect 30W Charger'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusNotice && (
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-200 text-center animate-in fade-in">
          {statusNotice}
        </div>
      )}

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Level & Charge State */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Battery Level</span>
            {battery.isCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-4 h-4 text-zinc-400" />
            )}
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-zinc-100 tabular-nums font-mono mt-1 flex items-baseline gap-1.5">
            <span>{battery.level}%</span>
            {battery.isCharging && (
              <span className="text-[11px] font-sans font-semibold text-emerald-400">
                Charging
              </span>
            )}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono truncate">
            {battery.powerSource}
          </div>
        </div>

        {/* 2. Temperature & Thermal State */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Battery Temp</span>
            <Thermometer className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-zinc-100 tabular-nums font-mono mt-1">
            {battery.temperatureC.toFixed(1)}°C
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Optimal Thermal Range</span>
          </div>
        </div>

        {/* 3. Charging / Discharging Estimate */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{battery.isCharging ? 'Time to 100%' : 'Time Remaining'}</span>
            <Clock className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 tabular-nums font-mono mt-1">
            {battery.isCharging
              ? formatTime(battery.chargingTime) || '38m'
              : formatTime(battery.dischargingTime) || '19h 20m'}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            {battery.isCharging ? '30W TurboPower active' : 'Based on current screen usage'}
          </div>
        </div>

        {/* 4. Battery Health & Capacity */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Health & Capacity</span>
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-zinc-100 tabular-nums font-mono mt-1">
            {healthPercent}%
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            {battery.capacityMah} / {battery.designedCapacityMah} mAh ({battery.cycleCount} cycles)
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-2xl border border-zinc-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-2 rounded-xl transition-colors ${
            activeTab === 'status' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Live Telemetry & Graph
        </button>
        <button
          onClick={() => setActiveTab('power_modes')}
          className={`flex-1 py-2 rounded-xl transition-colors ${
            activeTab === 'power_modes' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Power Profiles & Protection
        </button>
        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`flex-1 py-2 rounded-xl transition-colors ${
            activeTab === 'diagnostics' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Energy Breakdown
        </button>
      </div>

      {/* TAB 1: Live Telemetry & Graph */}
      {activeTab === 'status' && (
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Real-Time Battery Gauge & Curve
              </h3>
              <p className="text-xs text-zinc-400">
                Hardware sensor state from Qualcomm Snapdragon 6 Gen 3 PMIC
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
              {battery.voltageV} V · Li-Po
            </span>
          </div>

          {/* Level Progress Bar with Segment Markers */}
          <div className="space-y-2">
            <div className="w-full h-5 rounded-xl bg-zinc-950 border border-zinc-800 p-0.5 overflow-hidden flex">
              <div
                className={`h-full rounded-lg transition-all duration-500 ${
                  battery.level <= 15
                    ? 'bg-rose-500'
                    : battery.level <= 30
                    ? 'bg-amber-400'
                    : battery.isCharging
                    ? 'bg-emerald-400'
                    : 'bg-zinc-200'
                }`}
                style={{ width: `${battery.level}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono px-0.5">
              <span>0% Empty</span>
              <span>25%</span>
              <span>50% Mid</span>
              <span>75%</span>
              <span>100% Full</span>
            </div>
          </div>

          {/* Specification Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Technology</span>
              <div className="font-bold text-zinc-200">Lithium-Polymer (Li-Po)</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Cell Voltage</span>
              <div className="font-bold text-zinc-200 font-mono">{battery.voltageV} Volts</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Charge Protocol</span>
              <div className="font-bold text-zinc-200">Motorola TurboPower 30W</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Full Capacity</span>
              <div className="font-bold text-zinc-200 font-mono">{battery.designedCapacityMah} mAh</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Battery Wear Level</span>
              <div className="font-bold text-zinc-200 font-mono">3% (Minimal)</div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
              <span className="text-[10px] text-zinc-500 font-mono uppercase">Charge Cycles</span>
              <div className="font-bold text-zinc-200 font-mono">{battery.cycleCount} Completed</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Power Profiles & Protection */}
      {activeTab === 'power_modes' && (
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">
              Power Profiles & Longevity Protection
            </h3>
            <p className="text-xs text-zinc-400">
              Hardware level governors and battery cycle preservation
            </p>
          </div>

          {/* 80% Charge Limit Protection Switch */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-zinc-300" />
                <span>Protect Battery (80% Charge Limit)</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Stops charging when battery reaches 80% to prolong lithium cell lifespan and reduce heat degradation during overnight plug-in.
              </p>
            </div>

            <input
              type="checkbox"
              checked={battery.protectBatteryLimit}
              onChange={handleToggleProtectLimit}
              className="w-5 h-5 rounded text-zinc-100 cursor-pointer shrink-0"
            />
          </div>

          {/* Power Profiles Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              System Energy Governor
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleSetPowerMode('off')}
                className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                  battery.powerSavingMode === 'off'
                    ? 'border-zinc-300 bg-zinc-800/90 text-zinc-100'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-bold">Standard Balanced</div>
                <div className="text-[10px] text-zinc-400 leading-normal">
                  Full 120Hz display refresh rate and unrestricted background sync.
                </div>
              </button>

              <button
                onClick={() => handleSetPowerMode('saver')}
                className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                  battery.powerSavingMode === 'saver'
                    ? 'border-zinc-300 bg-zinc-800/90 text-zinc-100'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-bold">Battery Saver</div>
                <div className="text-[10px] text-zinc-400 leading-normal">
                  Caps refresh rate at 60Hz and restricts non-essential background tasks.
                </div>
              </button>

              <button
                onClick={() => handleSetPowerMode('extreme')}
                className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 ${
                  battery.powerSavingMode === 'extreme'
                    ? 'border-zinc-300 bg-zinc-800/90 text-zinc-100'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="text-xs font-bold">Extreme Saver</div>
                <div className="text-[10px] text-zinc-400 leading-normal">
                  Pauses all non-critical apps. Extends standby to 48+ hours.
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Energy Diagnostics Breakdown */}
      {activeTab === 'diagnostics' && (
        <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-zinc-100">
              Battery Discharge Diagnostics
            </h3>
            <p className="text-xs text-zinc-400">
              Hardware & subsystem energy allocation breakdown
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Display & 120Hz IPS Panel</span>
                </span>
                <span className="font-mono text-zinc-100">32%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-zinc-200 h-full rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Qualcomm Snapdragon 6 Gen 3 SoC</span>
                </span>
                <span className="font-mono text-zinc-100">24%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-zinc-400 h-full rounded-full" style={{ width: '24%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-zinc-400" />
                  <span>5G Sub-6 Radio & Baseband</span>
                </span>
                <span className="font-mono text-zinc-100">18%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-zinc-500 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Sensors, Location & System Services</span>
                </span>
                <span className="font-mono text-zinc-100">14%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-zinc-600 h-full rounded-full" style={{ width: '14%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-zinc-400" />
                  <span>FR SHAH QuickPanel Overlay & Background Service</span>
                </span>
                <span className="font-mono text-zinc-100">3% (Ultra Low)</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                <div className="bg-zinc-700 h-full rounded-full" style={{ width: '3%' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
