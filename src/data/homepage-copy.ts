import extraction from './homepage-copy-source.json';

/** The homepage's visible copy, one phrase per text node, kept apart from the data used to render
 * the website. It began as a TEXT-node extraction of canonical Figma 28:7; since Melo's version became
 * the homepage (29 Oct 2026) it holds that page's draft copy. Phrases that Figma or an earlier draft
 * already had keep their node or draft id; the rest are melo:<section>/<n>, pending Figma.
 * Typography/whitespace normalization and the explicit newsletter fallback
 * are applied only by scripts/check-copy.ts.
 */
interface CanonicalCopySource {
  fileKey: string;
  nodeId: string;
  extractedAt: string;
  sections: { id: string; name: string; text: string[][] }[];
}
export const homepageCopySource = extraction satisfies CanonicalCopySource;
