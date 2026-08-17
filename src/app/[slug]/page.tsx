import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConverterView } from "@/components/ConverterView";
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
  const url = `/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      type: "website",
      siteName: "Convertly",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

export default async function ConverterSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getConverterPage(slug);
  if (!page) notFound();

  const isPair = page.slug.includes("-to-");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: page.title,
    description: page.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (browser-based)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <ConverterView
        initialSource={page.from}
        initialTarget={isPair ? page.suggestedTarget : undefined}
        showApi={false}
      />
      <Footer />
    </>
  );
}
