import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/settings";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UserAuthForm } from "@/components/UserAuthForm";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const s = getSettings();
  return { title: `Login — ${s.siteName}`, robots: { index: false } };
}

export default function LoginPage() {
  // Route only exists when the admin enabled user accounts.
  if (!getSettings().authEnabled) notFound();
  return (
    <>
      <Header />
      <main className="grid min-h-[70vh] place-items-center px-6 py-16">
        <UserAuthForm mode="login" />
      </main>
      <Footer />
    </>
  );
}
