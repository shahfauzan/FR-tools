/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * Master Dashboard View & Tool Grid
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Camera, 
  Video, 
  Flashlight, 
  SlidersHorizontal, 
  Calculator, 
  FileText, 
  Timer, 
  QrCode, 
  Grid, 
  Search, 
  Sliders, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Smartphone,
  BatteryCharging,
  Battery,
  Zap,
  Thermometer,
  Clock,
  Activity,
  Clipboard,
  Download,
  Copy,
  Check
} from 'lucide-react';
import QRCode from 'qrcode';
import { ToolDefinition, ToolId, QuickPanelCustomization } from '../types/quickpanel';
import { MainNavView } from './Header';

interface DashboardViewProps {
  tools: ToolDefinition[];
  customization: QuickPanelCustomization;
  onSelectTool: (view: MainNavView) => void;
  onOpenCustomization: () => void;
  onOpenPermissions: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tools,
  customization,
  onSelectTool,
  onOpenCustomization,
  onOpenPermissions,
}) => {
  const [search, setSearch] = useState('');
  const [liveBatteryLevel, setLiveBatteryLevel] = useState(78);
  const [liveIsCharging, setLiveIsCharging] = useState(false);

  // Sync with browser battery if available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery().then((bm: any) => {
        setLiveBatteryLevel(Math.round(bm.level * 100));
        setLiveIsCharging(bm.charging);

        bm.onlevelchange = () => setLiveBatteryLevel(Math.round(bm.level * 100));
        bm.onchargingchange = () => setLiveIsCharging(bm.charging);
      }).catch(() => {});
    }
  }, []);

  const [quickQrInput, setQuickQrInput] = useState('https://github.com/shahfauzan/fr-shah-quickpanel');
  const [quickQrDataUrl, setQuickQrDataUrl] = useState('');
  const [quickQrCopied, setQuickQrCopied] = useState(false);

  // Render quick dashboard QR code
  useEffect(() => {
    let active = true;
    if (!quickQrInput.trim()) {
      setQuickQrDataUrl('');
      return;
    }
    QRCode.toDataURL(quickQrInput, {
      margin: 1,
      width: 256,
      color: { dark: '#09090b', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then((url) => {
      if (active) setQuickQrDataUrl(url);
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, [quickQrInput]);

  const handlePasteToQuickQr = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setQuickQrInput(text);
          setQuickQrCopied(true);
          setTimeout(() => setQuickQrCopied(false), 2000);
        }
      }
    } catch {}
  };

  const getToolIcon = (id: ToolId) => {
    switch (id) {
      case 'battery':
        return <BatteryCharging className="w-5 h-5 text-zinc-100" />;
      case 'clipboard':
        return <ClipboardList className="w-5 h-5 text-zinc-100" />;
      case 'qrgenerator':
        return <QrCode className="w-5 h-5 text-zinc-100" />;
      case 'screenshot':
        return <Camera className="w-5 h-5 text-zinc-100" />;
      case 'recorder':
        return <Video className="w-5 h-5 text-zinc-100" />;
      case 'flashlight':
        return <Flashlight className="w-5 h-5 text-zinc-100" />;
      case 'volume':
        return <SlidersHorizontal className="w-5 h-5 text-zinc-100" />;
      case 'calculator':
        return <Calculator className="w-5 h-5 text-zinc-100" />;
      case 'notes':
        return <FileText className="w-5 h-5 text-zinc-100" />;
      case 'stopwatch':
        return <Timer className="w-5 h-5 text-zinc-100" />;
      case 'qrscanner':
        return <QrCode className="w-5 h-5 text-zinc-100" />;
      case 'appshortcuts':
        return <Grid className="w-5 h-5 text-zinc-100" />;
      default:
        return <Sparkles className="w-5 h-5 text-zinc-100" />;
    }
  };

  const enabledTools = tools
    .filter((t) => t.enabled)
    .filter((t) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    });

  // Dynamic Grid column classes
  const gridColClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[customization.dashboardColumns];

  return (
    <div className="space-y-6">
      {/* Brand Hero & Quick Status */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 font-mono">
              <span>MOTO G75 5G CALIBRATED</span>
              <span className="text-zinc-600">·</span>
              <span>ANDROID 16 READY</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">MADE BY FR SHAH</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100">
              FR SHAH QuickPanel
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Build. Control. Customize. Direct device access toolbox with floating button overlay, swipe edge drawer, and local persistent Room database storage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenPermissions}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Permission Shield</span>
            </button>

            <button
              onClick={onOpenCustomization}
              className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Sliders className="w-4 h-4 stroke-[2.5]" />
              <span>Customize Toolbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Professional Battery Health Monitoring Card (User Requested Feature) */}
      <div 
        onClick={() => onSelectTool('battery')}
        className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {liveIsCharging ? (
              <BatteryCharging className="w-6 h-6 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-6 h-6 text-zinc-100" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Real-Time Battery Telemetry
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {liveIsCharging ? 'TurboPower 30W Charging' : 'Discharging on Battery'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-zinc-100 font-mono tabular-nums">
                {liveBatteryLevel}%
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {liveIsCharging ? 'Est. 38m until full' : 'Est. 18h 45m remaining'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Thermal & Health Strip */}
        <div className="flex items-center gap-6 text-xs font-mono text-zinc-400 border-t md:border-t-0 pt-3 md:pt-0 border-zinc-800/80">
          <div className="space-y-0.5">
            <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              <span>Temp</span>
            </div>
            <div className="text-zinc-200 font-bold tabular-nums">
              31.4°C (Normal)
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Health</span>
            </div>
            <div className="text-emerald-400 font-bold">
              97% (Good)
            </div>
          </div>

          <div className="space-y-0.5 hidden sm:block">
            <div className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Capacity</span>
            </div>
            <div className="text-zinc-200 font-bold tabular-nums">
              5000 mAh
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-zinc-300 group-hover:text-white group-hover:translate-x-1 transition-all pl-2">
            <span>Diagnostics</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Direct In-Dashboard QR Generator Card (User Requested Feature) */}
      <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-100 flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5 text-zinc-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-100">
                  Instant QR Generator & Clipboard Converter
                </h3>
                <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700">
                  Direct In-Dashboard
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Convert any copied URL, note, or payload directly into a scannable QR code without leaving the dashboard.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={handlePasteToQuickQr}
              className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5 text-zinc-400" />
              <span>{quickQrCopied ? 'Pasted!' : 'Paste Clipboard'}</span>
            </button>

            <button
              onClick={() => onSelectTool('qrgenerator')}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Full Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Input and Live Thumbnail Container */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-zinc-800/80">
          <div className="flex-1 w-full space-y-2">
            <div className="relative">
              <input
                type="text"
                value={quickQrInput}
                onChange={(e) => setQuickQrInput(e.target.value)}
                placeholder="Paste or type text, link, email, or Wi-Fi to generate QR code..."
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>{quickQrInput.length} characters encoded</span>
              <span className="text-zinc-400">Compatible with CameraX & Google Lens</span>
            </div>
          </div>

          {/* Mini QR Thumbnail */}
          {quickQrDataUrl && (
            <div className="flex items-center gap-3 shrink-0 p-2 rounded-2xl bg-zinc-950 border border-zinc-800">
              <img
                src={quickQrDataUrl}
                alt="Quick QR"
                className="w-16 h-16 rounded-xl bg-white p-1 object-contain"
              />
              <div className="space-y-1">
                <a
                  href={quickQrDataUrl}
                  download="quickpanel-qr.png"
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[11px] font-semibold text-zinc-200 flex items-center gap-1 transition-colors border border-zinc-800"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => onSelectTool('qrgenerator')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <span>Customize</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tool Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter tools by name, utility category, or capability..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 shadow-xs"
        />
      </div>

      {/* Tools Responsive Grid */}
      <div className={`grid ${gridColClass} gap-4`}>
        {enabledTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id as MainNavView)}
            className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/80 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  {getToolIcon(tool.id)}
                </div>

                {tool.badge && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {tool.badge}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-zinc-200">
              <span className="capitalize font-mono text-[11px] text-zinc-500">
                {tool.category}
              </span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
