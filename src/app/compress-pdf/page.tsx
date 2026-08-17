import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OptimizeTool } from "@/components/OptimizeTool";

export const metadata: Metadata = {
  title: "Compress PDF — Reduce PDF File Size Online Free",
  description:
    "Compress PDF files online to reduce their size while keeping quality. Free, fast, and secure — right in your browser, no sign-up.",
  alternates: { canonical: "/compress-pdf" },
  openGraph: {
    title: "Compress PDF — Reduce PDF File Size Online Free",
    description: "Compress PDF files online to reduce their size while keeping quality. Free and fast, no sign-up.",
    url: "/compress-pdf",
    type: "website",
    siteName: "Convertly",
  },
};

export default function CompressPdfPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-12">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Compress PDF</h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Shrink your PDF file size while keeping it readable. Drop a PDF and download a
              smaller version — free, fast, no sign-up.
            </p>
          </div>
          <OptimizeTool op="compress-pdf" accept=".pdf" verb="Compress" />
        </section>
      </main>
      <Footer />
    </>
  );
}
