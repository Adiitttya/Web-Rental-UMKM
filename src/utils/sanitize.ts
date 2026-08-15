/**
 * Input Security & XSS / Injection Defense Utility Module
 */

// HTML entity map for escaping XSS payloads
const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
};

/**
 * Escapes HTML entities in strings to prevent Cross-Site Scripting (XSS)
 */
export const escapeHtml = (str: string): string => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[&<>"'/`]/g, (char) => HTML_ENTITY_MAP[char] || char);
};

/**
 * Strips HTML tags, script protocols, control characters, and limits string length.
 */
export const sanitizeText = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input;

  // 1. Remove NULL bytes and non-printable control characters (ASCII 0-31 except \n \r \t)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Strip dangerous URI protocols (e.g. javascript:, data:text/html, vbscript:)
  sanitized = sanitized.replace(/javascript\s*:/gi, '');
  sanitized = sanitized.replace(/data\s*:\s*text\/html/gi, '');
  sanitized = sanitized.replace(/vbscript\s*:/gi, '');

  // 3. Remove inline HTML tags (e.g., <script>, <iframe>, <img onerror=...>)
  sanitized = sanitized.replace(/<[^>]*>?/gm, '');

  // 4. Escape remaining HTML entities to render safely as text
  sanitized = escapeHtml(sanitized);

  // 5. Enforce maximum payload length limit to prevent Buffer Overflow & ReDoS DoS
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized.trim();
};

/**
 * Sanitizes search input to prevent ReDoS (Regular Expression Denial of Service)
 * and injection attacks in search filters.
 */
export const sanitizeSearchQuery = (query: string, maxLength: number = 100): string => {
  if (!query || typeof query !== 'string') return '';
  
  // Strip dangerous regex special characters that could alter regex logic or cause ReDoS
  let clean = query.replace(/[\\^$*+?.()|[\]{}]/g, '');
  clean = sanitizeText(clean, maxLength);
  
  return clean;
};
