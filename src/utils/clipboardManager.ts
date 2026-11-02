/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Android ClipboardManager & Foreground Focus Policy Implementation
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

export interface ClipboardEventPayload {
  content: string;
  source: 'foreground_auto' | 'manual_paste' | 'system_share' | 'quick_action';
  timestamp: number;
}

type ClipListener = (payload: ClipboardEventPayload) => void;
type PrivacyToastListener = (data: { message: string; preview?: string; type: 'copy' | 'capture' | 'warning' }) => void;

class AndroidClipboardService {
  private listeners: Set<ClipListener> = new Set();
  private privacyListeners: Set<PrivacyToastListener> = new Set();
  private lastCapturedText: string = '';
  private isForeground: boolean = true;
  private autoCaptureEnabled: boolean = true;

  constructor() {
    this.initForegroundTracking();
  }

  private initForegroundTracking() {
    if (typeof window === 'undefined') return;

    // Track foreground window state (Android 10+ compliance)
    window.addEventListener('focus', () => {
      this.isForeground = true;
      if (this.autoCaptureEnabled) {
        this.checkForegroundClipboard();
      }
    });

    window.addEventListener('blur', () => {
      this.isForeground = false;
    });

    document.addEventListener('visibilitychange', () => {
      this.isForeground = !document.hidden;
      if (this.isForeground && this.autoCaptureEnabled) {
        this.checkForegroundClipboard();
      }
    });
  }

  public setAutoCapture(enabled: boolean) {
    this.autoCaptureEnabled = enabled;
  }

  public subscribe(listener: ClipListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public subscribePrivacyToast(listener: PrivacyToastListener): () => void {
    this.privacyListeners.add(listener);
    return () => this.privacyListeners.delete(listener);
  }

  private notify(payload: ClipboardEventPayload) {
    this.listeners.forEach((fn) => {
      try {
        fn(payload);
      } catch (e) {
        console.error('Error notifying clip listener:', e);
      }
    });
  }

  public notifyPrivacyToast(message: string, preview?: string, type: 'copy' | 'capture' | 'warning' = 'copy') {
    this.privacyListeners.forEach((fn) => {
      try {
        fn({ message, preview, type });
      } catch (e) {
        console.error('Error notifying privacy listener:', e);
      }
    });
  }

  /**
   * Foreground check following Android 10+ restrictions.
   * Only reads when foreground is active and user has granted permission.
   */
  public async checkForegroundClipboard(): Promise<string | null> {
    if (!this.isForeground || !this.autoCaptureEnabled) return null;
    if (typeof navigator === 'undefined' || !navigator.clipboard?.readText) return null;

    try {
      const text = await navigator.clipboard.readText();
      const trimmed = text?.trim();
      if (trimmed && trimmed !== this.lastCapturedText && trimmed.length > 0) {
        this.lastCapturedText = trimmed;
        this.notify({
          content: trimmed,
          source: 'foreground_auto',
          timestamp: Date.now(),
        });
        this.notifyPrivacyToast('Captured from foreground clipboard', trimmed.slice(0, 40), 'capture');
        return trimmed;
      }
    } catch {
      // Browser permission might not be granted yet, which is expected and handled gracefully
    }
    return null;
  }

  /**
   * Copy to system clipboard with Android 13+ visual feedback
   */
  public async copyToClipboard(text: string, title?: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-https/legacy contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      this.lastCapturedText = text.trim();
      this.notifyPrivacyToast(
        title ? `Copied: ${title}` : 'Copied to clipboard · FR SHAH QuickPanel',
        text.slice(0, 36),
        'copy'
      );
      return true;
    } catch (e) {
      console.error('Failed to write to clipboard:', e);
      return false;
    }
  }

  /**
   * Manual paste or share-to-app simulation
   */
  public manualPaste(text: string, source: 'manual_paste' | 'system_share' = 'manual_paste') {
    const trimmed = text.trim();
    if (!trimmed) return;
    this.lastCapturedText = trimmed;
    this.notify({
      content: trimmed,
      source,
      timestamp: Date.now(),
    });
    this.notifyPrivacyToast(
      source === 'system_share' ? 'Received from Android Share Sheet' : 'Saved to FR SHAH Clipboard History',
      trimmed.slice(0, 40),
      'capture'
    );
  }
}

export const androidClipboard = new AndroidClipboardService();
