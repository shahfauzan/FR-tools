/**
 * FR SHAH SMART CLIPBOARD MANAGER
 * Content Classification & Sensitive Data Detection
 * DEVELOPER CREDIT: MADE BY FR SHAH
 */

import { ContentType, ClipboardEntry } from '../types/clipboard';

/**
 * Deterministic hash function (DJB2 + hex string) for fast indexing and duplicate detection.
 */
export function generateContentHash(str: string): string {
  let hash = 5381;
  const trimmed = str.trim();
  for (let i = 0; i < trimmed.length; i++) {
    hash = (hash * 33) ^ trimmed.charCodeAt(i);
  }
  // Convert to unsigned 32-bit hex
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  // Combine with length to avoid collisions for simple permutations
  return `${hex}-${trimmed.length}`;
}

/**
 * Intelligent content classification engine.
 * Never executes actions automatically.
 */
export function classifyContent(text: string): {
  contentType: ContentType;
  metadata: NonNullable<ClipboardEntry['metadata']>;
} {
  const trimmed = text.trim();
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lineCount = text.split('\n').length;

  // 1. URL Detection
  const urlRegex = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
  const broadUrlRegex = /^https?:\/\/[^\s]+$/i;
  if (urlRegex.test(trimmed) || broadUrlRegex.test(trimmed)) {
    let domain = '';
    try {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      domain = parsed.hostname;
    } catch {
      domain = trimmed.split('/')[0] || '';
    }
    return {
      contentType: 'url',
      metadata: { charCount, wordCount, lineCount, urlDomain: domain }
    };
  }

  // 2. Email Address Detection
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(trimmed)) {
    return {
      contentType: 'email',
      metadata: { charCount, wordCount, lineCount }
    };
  }

  // 3. Phone Number Detection (Standard international & domestic patterns)
  const phoneRegex = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?[\d\-.\s]{6,15}$/;
  // Ensure it contains at least 7 digits and is not just a regular number or code
  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (phoneRegex.test(trimmed) && digitCount >= 7 && digitCount <= 15 && !trimmed.includes('\n')) {
    return {
      contentType: 'phone',
      metadata: { charCount, wordCount, lineCount }
    };
  }

  // 4. Code Snippet Detection
  const codeIndicators = [
    /\b(function|const|let|var|def|class|import\s+.*\s+from|export\s+default|async\s+function|return\b|console\.log)/,
    /\b(SELECT\s+.*\s+FROM|INSERT\s+INTO|UPDATE\s+.*\s+SET|DELETE\s+FROM)\b/i,
    /\b(public\s+class|private\s+void|protected\s+|System\.out\.println)/,
    /\b(if\s*\(.*\)\s*\{|for\s*\(.*\)\s*\{|while\s*\(.*\)\s*\{)/,
    /\b(npm\s+install|git\s+(commit|push|pull|clone|checkout)|docker\s+run|sudo\s+apt)/,
    /^(<[a-z][\s\S]*>|<\/[a-z]>)$/i, // HTML/XML tags
    /^(\{|\s*")[^"]*":\s*.*\}$/s // JSON object
  ];

  let detectedLanguage: string | undefined;
  if (codeIndicators.some(pattern => pattern.test(trimmed))) {
    if (trimmed.includes('SELECT') || trimmed.includes('INSERT INTO')) detectedLanguage = 'SQL';
    else if (trimmed.includes('def ') || trimmed.includes('import numpy') || trimmed.includes('print(')) detectedLanguage = 'Python';
    else if (trimmed.includes('git ') || trimmed.includes('npm ') || trimmed.includes('docker ') || trimmed.startsWith('$ ') || trimmed.startsWith('curl ')) detectedLanguage = 'Shell';
    else if (trimmed.startsWith('{') && trimmed.endsWith('}')) detectedLanguage = 'JSON';
    else if (trimmed.includes('public class') || trimmed.includes('System.out')) detectedLanguage = 'Java / Kotlin';
    else detectedLanguage = 'JavaScript / TypeScript';

    return {
      contentType: 'code',
      metadata: { charCount, wordCount, lineCount, codeLanguage: detectedLanguage }
    };
  }

  // 5. Other Text (e.g. Markdown headers, lists, tabular text)
  if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.includes('|---|') || trimmed.startsWith('- [ ]') || lineCount > 4) {
    return {
      contentType: 'other',
      metadata: { charCount, wordCount, lineCount }
    };
  }

  // 6. Default to Plain Text
  return {
    contentType: 'plain_text',
    metadata: { charCount, wordCount, lineCount }
  };
}

/**
 * Intelligent sensitive data detection (Passwords, OTPs, API keys, JWT, Credit Cards).
 */
export function detectSensitive(text: string): ClipboardEntry['detectedSensitive'] | undefined {
  const trimmed = text.trim();

  // 1. One-Time Passwords (OTPs / 2FA verification codes)
  // 4 to 8 isolated digits or words like "OTP is 123456", "code: 849201"
  const otpStandalone = /^\d{4,8}$/;
  const otpInSentence = /(?:otp|verification code|security code|passcode|one-time password|pin)[\s:]*([0-9]{4,8})\b/i;
  if (otpStandalone.test(trimmed) || otpInSentence.test(trimmed)) {
    return {
      type: 'otp',
      label: 'One-Time Verification Passcode'
    };
  }

  // 2. Secret API Keys & Access Tokens
  const apiKeyPatterns = [
    { regex: /sk-[a-zA-Z0-9]{20,}/, label: 'OpenAI / Secret API Key' },
    { regex: /ghp_[a-zA-Z0-9]{20,}/, label: 'GitHub Personal Access Token' },
    { regex: /AKIA[0-9A-Z]{16}/, label: 'AWS Access Key ID' },
    { regex: /AIzaSy[a-zA-Z0-9_-]{33}/, label: 'Google Cloud API Key' },
    { regex: /(?:api[_-]?key|secret[_-]?key|auth[_-]?token|bearer)[\s:="']+([a-zA-Z0-9_\-.]{16,})/i, label: 'Sensitive API/Auth Token' }
  ];
  for (const item of apiKeyPatterns) {
    if (item.regex.test(trimmed)) {
      return {
        type: 'api_key',
        label: item.label
      };
    }
  }

  // 3. JWT Tokens (Three base64 segments separated by dots starting with eyJ)
  const jwtRegex = /^eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/;
  if (jwtRegex.test(trimmed)) {
    return {
      type: 'jwt_token',
      label: 'JSON Web Token (JWT Session)'
    };
  }

  // 4. Passwords in context
  const passwordInContext = /(?:password|passwd|pwd|passphrase)[\s:=]+([^\s]{6,})/i;
  if (passwordInContext.test(trimmed)) {
    return {
      type: 'password',
      label: 'Likely Password Credential'
    };
  }

  // 5. Credit Card numbers (13 to 19 digits, possibly hyphenated or spaced)
  const ccRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;
  const cleanDigits = trimmed.replace(/[\s-]/g, '');
  if (cleanDigits.length >= 13 && cleanDigits.length <= 19 && /^\d+$/.test(cleanDigits)) {
    if (ccRegex.test(cleanDigits)) {
      return {
        type: 'credit_card',
        label: 'Payment Card / PAN Number'
      };
    }
  }

  return undefined;
}

/**
 * Mask sensitive content for safe preview.
 */
export function maskSensitiveContent(text: string): string {
  if (text.length <= 8) {
    return '••••••••';
  }
  const start = text.slice(0, 3);
  const end = text.slice(-3);
  return `${start}••••••••••••${end}`;
}
