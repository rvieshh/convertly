"use client";

import { useUploadHandoff } from "@/components/UploadContext";
import { CatalogSecurity } from "@/components/CatalogSecurity";
import { ConversionTypes } from "@/components/ConversionTypes";

/**
 * Homepage section 2 that reacts to the hero converter selection in real time:
 *   nothing chosen -> Format Catalog + Data Security
 *   source only     -> conversion lists (Convert from/to X)
 *   source + target -> dual format explanation cards
 * All without a page reload — the hero only rewrites the URL, the section
 * follows the shared context.
 */
export function HomeSection2() {
  const h = useUploadHandoff();
  const src = h?.heroSource ?? "";
  const tgt = h?.heroTarget ?? "";

  if (!src) return <CatalogSecurity />;
  return <ConversionTypes format={src} target={tgt || undefined} />;
}
