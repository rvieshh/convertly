import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DocsBody } from "@/components/DocsBody";

export const metadata: Metadata = {
  title: "API Docs — Convertly File Conversion API",
  description:
    "Convertly's HTTP API: convert and optimize files programmatically. Endpoints, parameters, and copy-paste examples in curl, JavaScript, and Python.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "API Docs — Convertly File Conversion API",
    description: "Convert and optimize files programmatically with Convertly's simple HTTP API.",
    url: "/docs",
    type: "website",
    siteName: "Convertly",
  },
};

export default function DocsPage() {
  return (
    <>
      <Header />
      <main className="relative">
        <DocsBody />
      </main>
      <Footer />
    </>
  );
}
