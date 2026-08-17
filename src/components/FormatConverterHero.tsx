import { ConvertWorkspace } from "@/components/ConvertWorkspace";
import type { ConverterPage } from "@/lib/converterPages";

/**
 * Per-format converter page body. Unlike the homepage, this mirrors
 * CloudConvert's dedicated converter route: a compact heading, then a
 * full-width workspace that fills the viewport — no split hero, no side
 * graphic. The workspace itself carries the file rows + sticky action bar.
 */
export function FormatConverterHero({ page }: { page: ConverterPage }) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10 lg:px-12">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {page.fromLabel} Converter
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          Convert {page.fromLabel} files to {page.suggestedTarget.toUpperCase()} and other formats
          — free, fast, no sign-up.
        </p>
      </div>

      <ConvertWorkspace defaultTarget={page.suggestedTarget} />
    </section>
  );
}
