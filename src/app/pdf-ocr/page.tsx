import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OptimizeTool } from "@/components/OptimizeTool";

export const metadata: Metadata = {
  title: "PDF OCR — Make Scanned PDFs Searchable Online Free",
  description:
    "Add a searchable text layer to scanned PDFs and images with OCR (English + Indonesian). Free, fast, and secure — right in your browser, no sign-up.",
  alternates: { canonical: "/pdf-ocr" },
  openGraph: {
    title: "PDF OCR — Make Scanned PDFs Searchable Online Free",
    description: "Add a searchable text layer to scanned PDFs with OCR. Free and fast, no sign-up.",
    url: "/pdf-ocr",
    type: "website",
    siteName: "Convertly",
  },
};

export default function PdfOcrPage() {
  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <section className="mx-auto max-w-3xl px-6 py-12 lg:px-12">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">PDF OCR</h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Turn a scanned PDF or image into a searchable, selectable PDF with OCR
              (English + Indonesian). Free, fast, no sign-up.
            </p>
          </div>
          <OptimizeTool op="pdf-ocr" accept=".pdf,.png,.jpg,.jpeg,.tiff" verb="OCR" />
        </section>
      </main>
      <Footer />
    </>
  );
}
