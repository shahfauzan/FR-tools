/**
 * FR SHAH QuickPanel · Build. Control. Customize.
 * QR Generator Tool · Instant conversion of copied text, URLs, and clipboard data
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Clipboard, 
  Link, 
  FileText, 
  Wifi, 
  Mail, 
  Phone, 
  User, 
  Sliders, 
  RefreshCw, 
  Sparkles, 
  ExternalLink, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  BookmarkPlus
} from 'lucide-react';
import { roomDb } from '../../db/roomDatabase';
import { ClipboardEntry } from '../../types/clipboard';
import { androidClipboard } from '../../utils/clipboardManager';

type PayloadMode = 'clipboard' | 'url' | 'text' | 'wifi' | 'contact' | 'email';
type QrStyleMode = 'high_contrast' | 'dark_carbon' | 'inverted_silver';

interface QrGeneratorToolProps {
  onBackToDashboard?: () => void;
  initialText?: string;
}

export const QrGeneratorTool: React.FC<QrGeneratorToolProps> = ({
  onBackToDashboard,
  initialText,
}) => {
  // Payload state
  const [mode, setMode] = useState<PayloadMode>('clipboard');
  const [content, setContent] = useState<string>(initialText || 'https://github.com/shahfauzan/fr-shah-quickpanel');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [styleMode, setStyleMode] = useState<QrStyleMode>('high_contrast');
  const [includeCenterBadge, setIncludeCenterBadge] = useState<boolean>(true);
  const [marginQuietZone, setMarginQuietZone] = useState<number>(2);

  // Structured templates
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');

  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Generated QR outputs
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvgString, setQrSvgString] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Recent clips from Room Database
  const [recentClips, setRecentClips] = useState<ClipboardEntry[]>([]);

  // Load latest clips from Room DB
  const loadRecentClips = useCallback(() => {
    try {
      const all = roomDb.getAllEntries();
      setRecentClips(all.slice(0, 8));
      // If mode is clipboard and content is default, load latest clip
      if (all.length > 0 && !initialText) {
        setContent(all[0].content);
      }
    } catch {
      // Fallback
    }
  }, [initialText]);

  useEffect(() => {
    loadRecentClips();
  }, [loadRecentClips]);

  // Compute final payload string depending on active template mode
  const getActivePayload = useCallback((): string => {
    switch (mode) {
      case 'url': {
        const trimmed = content.trim();
        if (!trimmed) return 'https://';
        if (!/^https?:\/\//i.test(trimmed)) {
          return `https://${trimmed}`;
        }
        return trimmed;
      }
      case 'wifi': {
        const h = wifiHidden ? 'H:true;' : '';
        const p = wifiType === 'nopass' ? '' : `P:${wifiPassword};`;
        return `WIFI:S:${wifiSsid};T:${wifiType};${p}${h};`;
      }
      case 'contact': {
        return [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${contactName || 'Contact'}`,
          contactPhone ? `TEL:${contactPhone}` : '',
          contactEmail ? `EMAIL:${contactEmail}` : '',
          contactOrg ? `ORG:${contactOrg}` : '',
          'END:VCARD'
        ].filter(Boolean).join('\n');
      }
      case 'email': {
        const params = new URLSearchParams();
        if (emailSubject) params.append('subject', emailSubject);
        if (emailBody) params.append('body', emailBody);
        const query = params.toString() ? `?${params.toString()}` : '';
        return `mailto:${emailTo}${query}`;
      }
      case 'clipboard':
      case 'text':
      default:
        return content || 'FR SHAH QuickPanel';
    }
  }, [mode, content, wifiSsid, wifiPassword, wifiType, wifiHidden, contactName, contactPhone, contactEmail, contactOrg, emailTo, emailSubject, emailBody]);

  // Generate QR Code data URL and SVG
  useEffect(() => {
    let isCancelled = false;
    const generate = async () => {
      setIsGenerating(true);
      try {
        const payload = getActivePayload();
        
        let darkColor = '#09090b';
        let lightColor = '#ffffff';

        if (styleMode === 'dark_carbon') {
          darkColor = '#18181b';
          lightColor = '#f4f4f5';
        } else if (styleMode === 'inverted_silver') {
          darkColor = '#f4f4f5';
          lightColor = '#18181b';
        }

        const options: QRCode.QRCodeToDataURLOptions = {
          errorCorrectionLevel: errorCorrection,
          margin: marginQuietZone,
          width: 512,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        };

        const dataUrl = await QRCode.toDataURL(payload, options);
        const svgString = await QRCode.toString(payload, {
          type: 'svg',
          errorCorrectionLevel: errorCorrection,
          margin: marginQuietZone,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        });

        if (!isCancelled) {
          setQrDataUrl(dataUrl);
          setQrSvgString(svgString);
        }
      } catch (err) {
        console.error('Failed to generate QR:', err);
      } finally {
        if (!isCancelled) {
          setIsGenerating(false);
        }
      }
    };

    generate();
    return () => {
      isCancelled = true;
    };
  }, [getActivePayload, errorCorrection, styleMode, marginQuietZone]);

  // Read from OS Clipboard
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setContent(text);
          // auto detect url
          if (/^https?:\/\//i.test(text.trim())) {
            setMode('url');
          } else {
            setMode('clipboard');
          }
          setCopyStatus('Pasted from clipboard');
          setTimeout(() => setCopyStatus(null), 2000);
          return;
        }
      }
    } catch {
      // Browser permissions restricted; fallback to roomDb latest clip
    }

    if (recentClips.length > 0) {
      setContent(recentClips[0].content);
      setCopyStatus('Loaded latest Room clip');
      setTimeout(() => setCopyStatus(null), 2000);
    }
  };

  // Download High-Res PNG
  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `FR_SHAH_QR_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download Vector SVG
  const handleDownloadSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FR_SHAH_QR_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy QR Image to Clipboard
  const handleCopyQrImage = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      if (navigator.clipboard && (window as any).ClipboardItem) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ [blob.type]: blob })
        ]);
        setCopyStatus('QR Image copied to clipboard');
        setTimeout(() => setCopyStatus(null), 2500);
        return;
      }
    } catch (e) {
      console.warn('Could not copy image binary directly, copying payload text:', e);
    }

    // Fallback: copy payload text
    await navigator.clipboard.writeText(getActivePayload());
    setCopyStatus('QR Payload text copied');
    setTimeout(() => setCopyStatus(null), 2500);
  };

  // Save generated QR payload as a new Clip in Room Database
  const handleSaveToQuickNotes = () => {
    const payload = getActivePayload();
    roomDb.insertEntry(payload, {
      tags: ['#qr_code', '#generator'],
      isPinned: false,
    });
    setSaveStatus('Saved to Smart Clipboard History');
    loadRecentClips();
    setTimeout(() => setSaveStatus(null), 2500);
  };

  // Share using Web Share API
  const handleShare = async () => {
    const payload = getActivePayload();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FR SHAH QuickPanel QR Code',
          text: payload,
          url: /^https?:\/\//i.test(payload) ? payload : undefined,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyQrImage();
    }
  };

  const currentPayload = getActivePayload();
  const byteCount = new Blob([currentPayload]).size;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 font-mono">
              <span>MOTO G75 5G CALIBRATED</span>
              <span className="text-zinc-600">·</span>
              <span>INSTANT CLIPBOARD CONVERTER</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">MADE BY FR SHAH</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2.5">
              <QrCode className="w-6 h-6 text-zinc-100" />
              <span>QR Generator & Clipboard Matrix</span>
            </h1>

            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Instantly encode copied clipboard text, website URLs, Wi-Fi credentials, or contacts into scannable high-resolution QR codes directly from QuickPanel.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePasteFromClipboard}
              className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold shadow-sm transition-all flex items-center gap-2"
              title="Paste recent clipboard content"
            >
              <Clipboard className="w-4 h-4 stroke-[2.5]" />
              <span>Paste from Clipboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Input and Template Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 1. Category / Template Segmented Control */}
          <div className="p-1 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setMode('clipboard')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                mode === 'clipboard' ? 'bg-zinc-800 text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Clipboard</span>
            </button>

            <button
              onClick={() => setMode('url')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                mode === 'url' ? 'bg-zinc-800 text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>URL / Link</span>
            </button>

            <button
              onClick={() => setMode('text')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                mode === 'text' ? 'bg-zinc-800 text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Plain Text</span>
            </button>

            <button
              onClick={() => setMode('wifi')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                mode === 'wifi' ? 'bg-zinc-800 text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Wi-Fi</span>
            </button>

            <button
              onClick={() => setMode('contact')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                mode === 'contact' ? 'bg-zinc-800 text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>vCard</span>
            </button>

            <button
              onClick={() => setMode('email')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                mode === 'email' ? 'bg-zinc-800 text-zinc-100 shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
          </div>

          {/* 2. Payload Inputs based on active mode */}
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            
            {/* Quick 1-Click Clipboard Pill Strip */}
            {recentClips.length > 0 && (
              <div className="space-y-2 pb-3 border-b border-zinc-800/80">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>ROOM DB CLIPBOARD HISTORY (1-CLICK LOAD)</span>
                  <span className="text-zinc-500">{recentClips.length} clips</span>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {recentClips.map((clip) => (
                    <button
                      key={clip.id}
                      onClick={() => {
                        setContent(clip.content);
                        if (/^https?:\/\//i.test(clip.content.trim())) {
                          setMode('url');
                        } else {
                          setMode('clipboard');
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono truncate max-w-[200px] transition-colors"
                      title={clip.content}
                    >
                      {clip.content}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Template: Plain Text or Clipboard */}
            {(mode === 'clipboard' || mode === 'text') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <label htmlFor="qr-content-text">Text Payload to Encode</label>
                  <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
                    {content.length} chars · {byteCount} bytes
                  </span>
                </div>
                <textarea
                  id="qr-content-text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter or paste any text, address, serial number, or raw data..."
                  rows={4}
                  className="w-full p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            )}

            {/* Template: URL */}
            {mode === 'url' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                  <label htmlFor="qr-url-input">Website or Web Resource Link</label>
                  <span className="text-[11px] font-mono text-zinc-500">Auto-formatted</span>
                </div>
                <div className="relative">
                  <Link className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="qr-url-input"
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="https://example.com or any web link..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  When scanned with a camera, this QR code immediately prompts to open the destination link.
                </p>
              </div>
            )}

            {/* Template: Wi-Fi Network */}
            {mode === 'wifi' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-zinc-300">
                  Wi-Fi Direct Connection Config
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Network Name (SSID)</label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="e.g. FR_SHAH_Office_5G"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Security Encryption</label>
                    <select
                      value={wifiType}
                      onChange={(e) => setWifiType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
                    >
                      <option value="WPA" className="bg-zinc-900">WPA / WPA2 / WPA3 (Default)</option>
                      <option value="WEP" className="bg-zinc-900">WEP (Legacy)</option>
                      <option value="nopass" className="bg-zinc-900">None (Open Network)</option>
                    </select>
                  </div>
                </div>

                {wifiType !== 'nopass' && (
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Wi-Fi Password / Key</label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={(e) => setWifiPassword(e.target.value)}
                      placeholder="Pre-shared key or password"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                  </div>
                )}

                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={wifiHidden}
                    onChange={(e) => setWifiHidden(e.target.checked)}
                    className="rounded bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-0"
                  />
                  <span>Hidden SSID Network</span>
                </label>
              </div>
            )}

            {/* Template: Contact vCard */}
            {mode === 'contact' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-zinc-300">
                  vCard 3.0 Contact Card
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Full Name</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Fauzan Shah"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Phone Number</label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Email Address</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="shah@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-400">Organization / Title</label>
                    <input
                      type="text"
                      value={contactOrg}
                      onChange={(e) => setContactOrg(e.target.value)}
                      placeholder="FR SHAH Engineering"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Template: Email */}
            {mode === 'email' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-zinc-300">
                  Direct Mailto Configuration
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Recipient Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="contact@frshah.dev"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Email Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="QuickPanel Inquiry"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Pre-filled Body</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Type initial message content..."
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. Formatting & Optical Customization Engine */}
          <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                <span>QR Optical & Matrix Configuration</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-500 uppercase">ISO/IEC 18004</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Error Correction Level */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Error Correction</label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="L" className="bg-zinc-900">Low (7% recovery)</option>
                  <option value="M" className="bg-zinc-900">Medium (15% - Standard)</option>
                  <option value="Q" className="bg-zinc-900">Quartile (25% recovery)</option>
                  <option value="H" className="bg-zinc-900">High (30% - Robust)</option>
                </select>
              </div>

              {/* Style & Contrast Mode */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Color Contrast Mode</label>
                <select
                  value={styleMode}
                  onChange={(e) => setStyleMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value="high_contrast" className="bg-zinc-900">Pure Black on White (100% Scan)</option>
                  <option value="dark_carbon" className="bg-zinc-900">Dark Carbon on Off-White</option>
                  <option value="inverted_silver" className="bg-zinc-900">Inverted Silver on Charcoal</option>
                </select>
              </div>

              {/* Margin / Quiet Zone */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Quiet Zone Margin</label>
                <select
                  value={marginQuietZone}
                  onChange={(e) => setMarginQuietZone(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                >
                  <option value={1} className="bg-zinc-900">Compact (1 module)</option>
                  <option value={2} className="bg-zinc-900">Standard (2 modules)</option>
                  <option value={4} className="bg-zinc-900">Wide ISO (4 modules)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCenterBadge}
                  onChange={(e) => setIncludeCenterBadge(e.target.checked)}
                  className="rounded bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-0"
                />
                <span>Include FR SHAH Center Emblem</span>
              </label>

              <span className="text-[11px] font-mono text-zinc-500">
                Density: {currentPayload.length > 100 ? 'High' : 'Normal'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live QR Preview & Export Center (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Real-time Rendered QR Card */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-5">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>LIVE OPTICAL MATRIX</span>
              </span>
              <span>{isGenerating ? 'Rendering...' : 'CameraX Ready'}</span>
            </div>

            {/* QR Visual Container */}
            <div className="relative mx-auto inline-block p-4 rounded-2xl bg-white shadow-2xl border-2 border-zinc-800/80 transition-transform">
              {qrDataUrl ? (
                <div className="relative">
                  <img
                    src={qrDataUrl}
                    alt="Generated QR Code"
                    className="w-56 h-56 sm:w-64 sm:h-64 object-contain select-none mx-auto"
                  />
                  {includeCenterBadge && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center shadow-lg border-2 border-white font-black text-xs tracking-tighter">
                        FR
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-zinc-400 text-xs font-mono">
                  Generating Matrix...
                </div>
              )}
            </div>

            {/* Live Payload Preview */}
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-left space-y-1">
              <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
                Encoded String Payload
              </div>
              <p className="text-xs font-mono text-zinc-300 break-all line-clamp-2 leading-relaxed">
                {currentPayload}
              </p>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleDownloadPng}
                disabled={!qrDataUrl}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-100 hover:bg-white active:scale-95 text-zinc-950 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handleDownloadSvg}
                disabled={!qrSvgString}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:scale-95 border border-zinc-800 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Vector SVG</span>
              </button>

              <button
                onClick={handleCopyQrImage}
                disabled={!qrDataUrl}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:scale-95 border border-zinc-800 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Image</span>
              </button>

              <button
                onClick={handleShare}
                disabled={!qrDataUrl}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:scale-95 border border-zinc-800 text-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                <span>Share QR</span>
              </button>
            </div>

            {/* Save to History Button */}
            <button
              onClick={handleSaveToQuickNotes}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <BookmarkPlus className="w-4 h-4 text-zinc-400" />
              <span>Save to Smart Clipboard History</span>
            </button>

            {/* Status Notices */}
            {copyStatus && (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-600 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{copyStatus}</span>
              </div>
            )}

            {saveStatus && (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-600 text-emerald-300 text-xs font-mono flex items-center justify-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{saveStatus}</span>
              </div>
            )}
          </div>

          {/* Device & Camera Validation Card */}
          <div className="p-4 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <span>Moto G75 5G Optics Compatibility</span>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Tested against Android CameraX ML Kit detector. Readable from up to 2.4 meters away at default 512px resolution with 15% error correction threshold.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
