import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OptimizeTool } from "@/components/OptimizeTool";

export const metadata: Metadata = {
  title: "Compress PNG — Reduce PNG File Size Online Free",
  description:
    "Compress PNG images online to reduce their size with transparency preserved. Free, fast, and secure — right in your browser, no sign-up.",
  alternates: { canonical: "/compress-png" },
  openGraph: {
    title: "Compress PNG — Reduce PNG File Size Online Free",
    description: "Compress PNG images online with transparency preserved. Free and fast, no sign-up.",
    url: "/compress-png",
    type: "website",
    siteName: "Convertly",
  },
};

export default function CompressPngPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-12">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Compress PNG</h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Reduce PNG image size with smart lossy compression — transparency kept intact.
              Free, fast, no sign-up.
            </p>
          </div>
          <OptimizeTool op="compress-png" accept=".png" verb="Compress" />
        </section>
      </main>
      <Footer />
    </>
  );
}
