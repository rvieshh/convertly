import { Header } from "@/components/Header";
import { ConvertWorkspace } from "@/components/ConvertWorkspace";
import { HeroConverter } from "@/components/HeroConverter";
import { CatalogSecurity } from "@/components/CatalogSecurity";
import { ApiSection } from "@/components/ApiSection";
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

        <section className="mx-auto max-w-[1600px] px-6 pt-5 pb-12 lg:px-12">
          {/* Top row: heading (left) + convert animation (right) */}
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Convert Any File</h1>
              <p className="mt-4 max-w-xl text-balance text-[18px] leading-relaxed text-zinc-400">
                Drop a file and pick what to turn it into. Convertly handles images, audio, and
                video — right in your browser, no sign-up.
              </p>
            </div>
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <HeroConverter />
            </div>
          </div>

          {/* Centered upload box (the focal element) */}
          <div className="mx-auto mt-6 w-full max-w-3xl">
            <ConvertWorkspace reflectUrl />
          </div>
        </section>

        <CatalogSecurity />
        <ApiSection />
      </main>

      <Footer />
    </>
  );
}
