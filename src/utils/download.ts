/**
 * Robust file-export helper.
 *
 * Sandboxed preview iframes and some browsers block downloads or lack
 * `URL.createObjectURL`. Instead of throwing (which made the Export buttons
 * look dead), we try several strategies and report whether one worked.
 */

function triggerAnchorDownload(url: string, filename: string): boolean {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  // Firefox requires the anchor to be in the document.
  document.body.appendChild(a);
  try {
    a.click();
    return true;
  } catch {
    return false;
  } finally {
    document.body.removeChild(a);
  }
}

/**
 * Download `content` as a file.
 * @returns true when a download was successfully triggered.
 */
export function downloadFile(filename: string, content: string, mimeType = 'text/plain'): boolean {
  // Strategy 1: Blob + object URL (best fidelity).
  try {
    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
      const ok = triggerAnchorDownload(url, filename);
      // Give the browser a moment to start the download before revoking.
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* ignore */
        }
      }, 10000);
      if (ok) return true;
    }
  } catch {
    /* fall through to data URI */
  }

  // Strategy 2: data: URI (works where object URLs are unavailable).
  try {
    const dataUrl = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
    if (triggerAnchorDownload(dataUrl, filename)) return true;
  } catch {
    /* fall through */
  }

  // Strategy 3: open in a new tab so the user still gets the payload.
  try {
    const dataUrl = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
    const win = window.open(dataUrl, '_blank');
    return win !== null;
  } catch {
    return false;
  }
}
