import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Roboto, Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import { UploadProvider } from "@/components/UploadContext";
import { SettingsProvider } from "@/components/SettingsProvider";
import { getSettings } from "@/lib/settings";

// A small curated set of admin-selectable fonts, each exposed as a CSS var.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-roboto" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

const FONT_VAR: Record<string, string> = {
  Inter: "var(--font-inter)",
  "Plus Jakarta Sans": "var(--font-jakarta)",
  Roboto: "var(--font-roboto)",
  Poppins: "var(--font-poppins)",
  Montserrat: "var(--font-montserrat)",
};

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const s = getSettings();
  return {
    title: `${s.siteName} — Convert Any File`,
    description: s.footerDescription,
    keywords: ["file converter", "image converter", "video converter", s.siteName.toLowerCase()],
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const s = getSettings();
  const fontVar = FONT_VAR[s.font] ?? "var(--font-inter)";
  const fontVars = `${inter.variable} ${jakarta.variable} ${roboto.variable} ${poppins.variable} ${montserrat.variable}`;

  // Inject admin-configured accent + font as inline CSS vars on <html>, and the
  // theme via a class so the light/dark token blocks in globals.css apply.
  const styleVars = {
    ["--primary" as string]: s.accent,
    ["--primary-hover" as string]: s.accentHover,
    ["--font-active" as string]: fontVar,
  } as React.CSSProperties;

  return (
    <html lang="en" className={s.theme === "light" ? "light" : "dark"} style={styleVars}>
      <body className={`${fontVars} antialiased`}>
        <SettingsProvider settings={s}>
          <UploadProvider>{children}</UploadProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
