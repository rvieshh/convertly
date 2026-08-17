import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OptimizeTool } from "@/components/OptimizeTool";

export const metadata: Metadata = {
  title: "Compress JPG — Reduce JPG File Size Online Free",
  description:
    "Compress JPG/JPEG images online to reduce their file size while keeping quality. Free, fast, and secure — right in your browser, no sign-up.",
  alternates: { canonical: "/compress-jpg" },
  openGraph: {
    title: "Compress JPG — Reduce JPG File Size Online Free",
    description: "Compress JPG/JPEG images online while keeping quality. Free and fast, no sign-up.",
    url: "/compress-jpg",
    type: "website",
    siteName: "Convertly",
  },
};

export default function CompressJpgPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-12">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Compress JPG</h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Reduce JPG/JPEG file size while keeping the image looking sharp. Drop a JPG and
              download a smaller one — free, fast, no sign-up.
            </p>
          </div>
          <OptimizeTool op="compress-jpg" accept=".jpg,.jpeg" verb="Compress" />
        </section>
      </main>
      <Footer />
    </>
  );
}
