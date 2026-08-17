import type { Metadata } from "next";
import { SetupForm } from "@/components/admin/SetupForm";

export const metadata: Metadata = {
  title: "Set up admin account — Convertly",
  robots: { index: false, follow: false },
};

export default function AdminSetupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6">
      <SetupForm />
    </main>
  );
}
