import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FormatConverterHero } from "@/components/FormatConverterHero";
import { FormatCatalog } from "@/components/FormatCatalog";
import { DataSecurity } from "@/components/DataSecurity";
import { getConverterPage, allConverterSlugs } from "@/lib/converterPages";

export function generateStaticParams() {
  return allConverterSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getConverterPage(slug);
  if (!page) return { title: "Convertly" };
  return { title: page.title, description: page.description };
}

export default async function ConverterSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getConverterPage(slug);
  if (!page) notFound();

  return (
    <>
      <Header />
      <main className="relative overflow-hidden">
        <FormatConverterHero page={page} />
        <FormatCatalog />
        <DataSecurity />
      </main>
      <Footer />
    </>
  );
}
