import { useState, useEffect, useRef, useCallback } from 'react';
import { getNoteUrl } from '../../lib/api';
import { Skeleton } from '../ui/Skeleton';

interface NotesViewerProps {
  chapterId: string;
  chapterTitle: string;
  subjectName: string;
}

/**
 * NotesViewer — implements Section ❺ iframe protocol EXACTLY.
 *
 * 1. Fetch signed URL from backend (NOT stored in Zustand)
 * 2. Fetch raw HTML string from CDN
 * 3. Inject postMessage height script if not present
 * 4. Create blob URL → set on iframe.src
 * 5. iframe fires postMessage → setIframeHeight
 * 6. On unmount: URL.revokeObjectURL(blobUrl)
 */
export function NotesViewer({ chapterId, chapterTitle, subjectName }: NotesViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // All state is LOCAL — never in Zustand
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [iframeHeight, setIframeHeight] = useState(600);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // ── Step 4: postMessage height listener ──
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'ef-notes-height') {
        setIframeHeight((e.data.height as number) + 40);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // ── Steps 1-3: Fetch & inject ──
  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Revoke previous blob URL
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }

    try {
      console.log(`[NotesViewer] Attempting to load notes for chapter: ${chapterId}`);
      
      // Step 1: Fetch signed URL from backend
      const { signed_url } = await getNoteUrl(chapterId);
      if (!signed_url) throw new Error('No signed URL returned from server');

      // Step 2: Fetch raw HTML from CDN
      console.log(`[NotesViewer] Fetching content from CDN...`);
      const response = await fetch(signed_url);
      if (!response.ok) {
        throw new Error(`CDN Error: ${response.status} ${response.statusText}`);
      }
      const rawHtml = await response.text();

      if (!rawHtml || rawHtml.length < 10) {
        throw new Error('Received empty or malformed HTML from CDN');
      }

      // Step 3: Inject postMessage height script if not present
      let html = rawHtml;
      if (!html.includes('ef-notes-height')) {
        const heightScript = `
<script>
  window.addEventListener('load', function() {
    window.parent.postMessage(
      { type: 'ef-notes-height', height: document.body.scrollHeight },
      '*'
    );
  });
  var ro = new ResizeObserver(function() {
    window.parent.postMessage(
      { type: 'ef-notes-height', height: document.body.scrollHeight },
      '*'
    );
  });
  ro.observe(document.body);
</script>`;
        if (html.includes('</body>')) {
          html = html.replace('</body>', heightScript + '</body>');
        } else {
          html = html + heightScript;
        }
      }

      setHtmlContent(html);

      // Step 5: Create blob URL
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
      console.log(`[NotesViewer] Successfully loaded notes for ${chapterId}`);
    } catch (err: unknown) {
      console.error(`[NotesViewer] Error loading notes:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // ── Cleanup: revoke blob URL on unmount ──
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton variant="text" lines={2} />
        <Skeleton variant="rect" className="h-96 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined text-[40px] text-error mb-4">
          error_outline
        </span>
        <h3 className="font-headline text-headline-sm text-on-surface mb-2">
          Failed to load notes
        </h3>
        <p className="text-body-md text-on-surface-variant mb-4">{error}</p>
        <button
          onClick={loadNotes}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-on-surface text-label-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-headline text-title-lg text-on-surface truncate">
            {chapterTitle}
          </h2>
          <span className="text-label-md text-on-surface-variant">{subjectName}</span>
        </div>
      </div>

      {/* Iframe — NO scrollbar, parent scrolls */}
      <iframe
        ref={iframeRef}
        title={`Notes: ${chapterTitle}`}
        sandbox="allow-scripts allow-same-origin"
        style={{
          height: iframeHeight,
          border: 'none',
          width: '100%',
        }}
      />
    </div>
  );
}
