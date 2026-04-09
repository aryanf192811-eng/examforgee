import { useState, useEffect, useRef, useCallback } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { getChapterMetadata } from '../../lib/manifest';

interface NotesViewerProps {
  subjectSlug: string;
  chapterSlug: string;
  chapterTitle: string;
  subjectName: string;
}

/**
 * NotesViewer — Hybrid Static Content Architecture (v3)
 * 
 * 1. Fetch metadata from manifest (same-origin cache)
 * 2. Fetch HTML file directly from /content/notes/
 * 3. Inject height script (iframe protocol)
 * 4. Create blob URL → set on iframe.src
 */
export function NotesViewer({ subjectSlug, chapterSlug, chapterTitle, subjectName }: NotesViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [iframeHeight, setIframeHeight] = useState(600);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // postMessage height listener
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'ef-notes-height') {
        setIframeHeight((e.data.height as number) + 40);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Revoke previous blob URL
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }

    try {
      console.log(`[NotesViewer] Loading: ${subjectSlug}/${chapterSlug}`);
      
      // Step 1: Get metadata for the file path
      const metadata = await getChapterMetadata(subjectSlug, chapterSlug);
      if (!metadata || !metadata.notes_file) {
        throw new Error('This chapter does not have static notes content yet.');
      }

      // Step 2: Construct HTML path directly from chapter slug
      const contentUrl = `/content/notes/${chapterSlug}.html`;
      console.log(`[NotesViewer] Loading from: ${contentUrl}`);
      
      const response = await fetch(contentUrl);
      if (!response.ok) {
        throw new Error(`Failed to load note file: ${response.status} ${response.statusText}`);
      }
      const rawHtml = await response.text();

      // Step 3: Inject postMessage height script if not present
      let html = rawHtml;
      if (!html.includes('ef-notes-height')) {
        const heightScript = `
<script>
  window.addEventListener('load', function() {
    window.parent.postMessage({ type: 'ef-notes-height', height: document.body.scrollHeight }, '*');
  });
  var ro = new ResizeObserver(function() {
    window.parent.postMessage({ type: 'ef-notes-height', height: document.body.scrollHeight }, '*');
  });
  ro.observe(document.body);
</script>`;
        if (html.includes('</body>')) {
          html = html.replace('</body>', heightScript + '</body>');
        } else {
          html = html + heightScript;
        }
      }

      // Step 4: Create blob URL
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
      console.log(`[NotesViewer] Successfully loaded ${metadata.notes_file}`);
    } catch (err: any) {
      console.error(`[NotesViewer] Error:`, err);
      setError(err.message || 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }, [subjectSlug, chapterSlug]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Cleanup
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
          Content not available
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
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-headline text-title-lg text-on-surface truncate">
            {chapterTitle}
          </h2>
          <span className="text-label-md text-on-surface-variant">{subjectName}</span>
        </div>
      </div>

      <iframe
        ref={iframeRef}
        src={blobUrl || 'about:blank'}
        title={`Notes: ${chapterTitle}`}
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => {
          // Manual trigger for height bridge
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'ef-notes-ping' }, '*');
          }
        }}
        style={{
          height: iframeHeight,
          border: 'none',
          width: '100%',
          display: blobUrl ? 'block' : 'none',
        }}
      />
    </div>
  );
}
