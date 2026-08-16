import { Header } from "@/components/Header";
import { Converter } from "@/components/Converter";
import { ConvertAnimation } from "@/components/ConvertAnimation";
import { PopularFormats } from "@/components/PopularFormats";

export default function Home() {
  return (
    <>
      <Header />

      <main className="relative overflow-hidden">
        {/* faint grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at top, black, transparent 70%)",
          }}
        />

        {/* Hero: two columns */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:py-20">
          {/* Left: copy + converter */}
          <div className="order-1">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Convert Any File
            </h1>
            <p className="mt-4 max-w-lg text-balance text-zinc-400">
              Drop a file and pick what to turn it into. Convertly handles images, audio, and
              video — right in your browser, no sign-up.
            </p>
            <div className="mt-8">
              <Converter />
            </div>
          </div>

          {/* Right: convert animation */}
          <div className="order-2 hidden lg:flex lg:items-center lg:justify-center">
            <ConvertAnimation />
          </div>
        </section>

        <PopularFormats />

        <footer className="border-t border-zinc-800/60 py-10 text-center text-sm text-zinc-600">
          <p>
            Backed by{" "}
            <a
              href="https://ravisen.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zinc-400 transition-colors hover:text-indigo-400"
            >
              Ravisen
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
