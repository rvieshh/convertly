"use client";

import { useEffect } from "react";
import { ConvertWorkspace } from "@/components/ConvertWorkspace";
import { HeroConverter } from "@/components/HeroConverter";
import { HeroHeadline } from "@/components/HeroHeadline";
import { HomeSection2 } from "@/components/HomeSection2";
import { ApiSection } from "@/components/ApiSection";
import { AvailableConverters } from "@/components/AvailableConverters";
import { useUploadHandoff } from "@/components/UploadContext";

export interface CategoryInfo {
  id: string;
  label: string;
  title: string;
  description: string;
  formats: string[];
}

/**
 * The shared landing/converter body used by the homepage (/), the per-format
 * routes (/png-converter, /png-to-jpg) AND the category routes
 * (/document-converter, /image-converter, ...).
 *
 *  - initialSource/initialTarget seed the hero so a reloaded format URL renders
 *    exactly like the homepage after the user picked those formats.
 *  - category switches the page into "category mode": a category headline and
 *    an AVAILABLE CONVERTERS grid instead of the per-format section 2.
 */
export function ConverterView({
  initialSource,
  initialTarget,
  showApi = true,
  category,
}: {
  initialSource?: string;
  initialTarget?: string;
  showApi?: boolean;
  category?: CategoryInfo;
}) {
  const h = useUploadHandoff();

  // Seed shared hero state from the route on first mount.
  useEffect(() => {
    if (category) {
      // Category pages don't lock a single source; start neutral so the hero
      // shows the category's first format but the headline stays category-wide.
      h?.setHeroSource("");
      h?.setHeroTarget("");
    } else {
      if (initialSource) h?.setHeroSource(initialSource);
      if (initialTarget) h?.setHeroTarget(initialTarget);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On a category page the hero previews the first format of that category.
  const heroSeed = category ? category.formats[0] : initialSource;

  // The true homepage (no format/category in the URL) reflects the chosen
  // format into the URL on upload; format/category pages load the workspace
  // inline instead of re-navigating.
  const isHome = !initialSource && !category;

  return (
    <main className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #34343a 1px, transparent 1px), linear-gradient(to bottom, #34343a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at top, black, transparent 75%)",
        }}
      />

      <section className="mx-auto max-w-[1600px] px-6 pt-5 pb-12 lg:px-12">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <HeroHeadline category={category ? { title: category.title, description: category.description } : undefined} />
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <HeroConverter
              initialSource={heroSeed}
              initialTarget={category ? undefined : initialTarget}
              sourceCategory={category?.id}
            />
          </div>
        </div>

        <div className="mx-auto mt-6 w-full max-w-3xl">
          <ConvertWorkspace
            reflectUrl={isHome}
            defaultTarget={category ? undefined : initialTarget}
            lockSource={!category && initialSource ? initialSource : undefined}
          />
        </div>
      </section>

      {category ? (
        <AvailableConverters categoryLabel={category.label} formats={category.formats} />
      ) : (
        <HomeSection2 />
      )}
      {showApi && <ApiSection />}
    </main>
  );
}
