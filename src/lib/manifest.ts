/**
 * ExamForge — Content Manifest Handler
 * Single source of truth for static content structure.
 */

export interface ManifestChapter {
  id: string;
  slug: string;
  title: string;
  order_index?: number;
  has_notes?: boolean;
  notes_file?: string;
}

export interface ManifestSubject {
  id: string;
  slug: string;
  name: string;
  category?: string;
  icon?: string;
  is_published?: boolean;
  chapters: ManifestChapter[];
}

export interface ContentManifest {
  version: string;
  last_updated: string;
  subjects: ManifestSubject[];
  skills: ManifestSubject[];
}

let manifestCache: ContentManifest | null = null;

/**
 * Fetches the manifest from the public content directory.
 * Caches the result in memory for the duration of the session.
 */
export async function getManifest(): Promise<ContentManifest> {
  if (manifestCache) return manifestCache;

  try {
    const response = await fetch('/content/manifest.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.statusText}`);
    }
    manifestCache = await response.json();
    return manifestCache!;
  } catch (error) {
    console.error('[Manifest] Error fetching manifest:', error);
    throw error;
  }
}

/**
 * Helper to find a specific chapter's metadata.
 */
export async function getChapterMetadata(subjectSlug: string, chapterSlug: string): Promise<ManifestChapter | null> {
  const manifest = await getManifest();
  const subject = manifest.subjects.find(s => s.slug === subjectSlug) || 
                  manifest.skills.find(s => s.slug === subjectSlug);
  
  if (!subject) return null;
  return subject.chapters.find(c => c.slug === chapterSlug) || null;
}
