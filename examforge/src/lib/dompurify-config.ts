import DOMPurify from 'dompurify';

export const DOMPURIFY_KATEX_CONFIG: any = {
  ADD_TAGS: [
    'math', 'mrow', 'mi', 'mo', 'mn', 'msup', 'msub', 'mfrac',
    'msubsup', 'munder', 'mover', 'munderover', 'mtable', 'mtr',
    'mtd', 'mtext', 'menclose', 'mspace', 'semantics', 'annotation',
    'annotation-xml', 'mstyle', 'mpadded', 'mphantom', 'msqrt',
    'mroot', 'merror', 'mglyph',
    'span',
  ],
  ADD_ATTR: [
    'xmlns', 'display', 'alttext', 'encoding', 'class', 'style',
    'aria-hidden', 'focusable', 'role', 'tabindex',
    'data-katex', 'data-token',
  ],
  FORBID_TAGS: ['script', 'style', 'link', 'meta', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  FORCE_BODY: true,
};

export const sanitizeNoteHtml = (html: string): string =>
  DOMPurify.sanitize(html, DOMPURIFY_KATEX_CONFIG) as unknown as string;
