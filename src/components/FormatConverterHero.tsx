import { ConvertWorkspace } from "@/components/ConvertWorkspace";
import { ConvertAnimation } from "@/components/ConvertAnimation";
import type { ConverterPage } from "@/lib/converterPages";

export function FormatConverterHero({ page }: { page: ConverterPage }) {
  return (
    <section className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-14 lg:grid-cols-2 lg:py-16">
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {page.fromLabel} Converter
        </h1>
        <p className="mt-4 max-w-lg text-balance text-[18px] leading-relaxed text-zinc-400">
          Convert your {page.fromLabel} files to {page.suggestedTarget.toUpperCase()} and other
          formats — free, fast, and right in your browser. No sign-up required.
        </p>
        <div className="mt-8">
          <ConvertWorkspace defaultTarget={page.suggestedTarget} />
        </div>
      </div>

      <div className="hidden lg:flex lg:items-center lg:justify-center">
        <ConvertAnimation />
      </div>
    </section>
  );
}
