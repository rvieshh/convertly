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
            maskImage: "radial-gradient(ellipse at top, black, transparent 70%)",
          }}
        />

        {/* Hero: two columns */}
        <section className="mx-auto grid max-w-[1600px] items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-12 lg:py-20">
          <div className="order-1">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Convert Any File</h1>
            <p className="mt-4 max-w-lg text-balance text-[18px] leading-relaxed text-zinc-400">
              Drop a file and pick what to turn it into. Convertly handles images, audio, and
              video — right in your browser, no sign-up.
            </p>
            <div className="mt-8">
              <ConvertWorkspace reflectUrl />
            </div>
          </div>

          <div className="order-2 hidden lg:flex lg:items-center lg:justify-center">
            <ConvertAnimation />
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
