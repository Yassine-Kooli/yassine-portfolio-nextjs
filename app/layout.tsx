import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

const sans = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://yassine-kooli.vercel.app"),
  title: "Yassine Kooli — Laravel Developer",
  description:
    "Yassine Kooli is a Laravel developer with 4+ years of experience building scalable web applications with Laravel, Filament, Livewire and REST APIs. Explore the portfolio in the YassineOS desktop.",
  keywords: ["Laravel developer", "Filament", "Livewire", "PHP", "Full-stack developer", "Yassine Kooli"],
  authors: [{ name: "Yassine Kooli" }],
  openGraph: {
    title: "Yassine Kooli — Laravel Developer",
    description: "Laravel developer · Filament · Livewire · REST APIs · SaaS platforms",
    type: "website",
    images: ["/images/profile.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
