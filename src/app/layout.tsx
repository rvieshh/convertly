import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Convertly — Convert Any File",
  description:
    "Free, fast file converter for images, audio, and video. Convert PNG to WebP, MP4 to MP3, and more — right in your browser. Backed by Ravisen.",
  keywords: ["file converter", "png to webp", "mp4 to mp3", "image converter", "convertly"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.variable} bg-zinc-950 text-zinc-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
