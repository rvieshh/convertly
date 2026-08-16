import { Header } from "@/components/Header";
import { ConvertWorkspace } from "@/components/ConvertWorkspace";
import { ConvertAnimation } from "@/components/ConvertAnimation";
import { PopularFormats } from "@/components/PopularFormats";
import { FormatCatalog } from "@/components/FormatCatalog";
import { DataSecurity } from "@/components/DataSecurity";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main className="relative overflow-hidden">
        {/* faint grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #34343a 1px, transparent 1px), linear-gradient(to bottom, #34343a 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at top, black, transparent 75%)",
          }}
        />

        <section className="mx-auto max-w-[1600px] px-6 py-14 lg:px-12 lg:py-16">
          {/* Top row: heading (left) + convert animation (right) */}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Convert Any File</h1>
              <p className="mt-4 max-w-xl text-balance text-[18px] leading-relaxed text-zinc-400">
                Drop a file and pick what to turn it into. Convertly handles images, audio, and
                video — right in your browser, no sign-up.
              </p>
            </div>
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <ConvertAnimation />
            </div>
          </div>

          {/* Centered upload box (the focal element) */}
          <div className="mx-auto mt-10 w-full max-w-3xl">
            <ConvertWorkspace reflectUrl />
          </div>

          {/* Footer teasers */}
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between text-sm">
            <a
              href="#formats"
              className="flex items-center gap-2 text-muted transition-colors hover:text-white"
            >
              Format Catalog
            </a>
            <a
              href="#security"
              className="flex items-center gap-2 text-muted transition-colors hover:text-white"
            >
              Data Security
            </a>
          </div>
        </section>

        <PopularFormats />
        <FormatCatalog />
        <DataSecurity />
      </main>

      <Footer />
    </>
  );
}
