import "./globals.css";
import type { Metadata, Viewport } from "next";
import { UnifrakturMaguntia, Cinzel, Cantarell, JetBrains_Mono } from "next/font/google";

const goth = UnifrakturMaguntia({ subsets: ["latin"], weight: "400", variable: "--font-goth" });
const display = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-display" });
const ui = Cantarell({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-ui" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "YassineOS — Yassine Kooli",
  description:
    "The portfolio of Yassine Kooli, Laravel developer — disguised as a dark Linux desktop. Open the terminal, browse the files, play some music.",
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${goth.variable} ${display.variable} ${ui.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
