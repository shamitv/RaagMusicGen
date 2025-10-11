export function downloadFromUrl(url: string, filename: string) {
  // Create an anchor and click it to trigger a download for the provided URL
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  // Some browsers require the anchor to be in the document
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke the object URL after a short delay to allow the download to start
  try {
    setTimeout(() => { URL.revokeObjectURL(url); }, 1000);
  } catch {
    // ignore
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  downloadFromUrl(url, filename);
}
