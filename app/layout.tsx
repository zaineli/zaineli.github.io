import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { metaDescription, profile } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Two families, one rule: the serif carries everything a reader reads (the
// thesis, names, his sentences, the write-ups); the grotesk carries
// everything a reader measures (numbers, labels, figures, tables). Both are
// self-hosted subsets cut by pyftsubset, because Google's latin subset drops
// → (printed a dozen times) and ≥ ≈ Δ − on the case pages.
//
// Source Serif 4 is instanced to wght 400–650 and opsz 16–60, so the thesis
// gets the display cut and the prose gets the text cut from one file; the
// italic is a single static instance at text size, used only for his quoted
// sentences.
const sourceSerif = localFont({
  src: [
    { path: "./fonts/SourceSerif4-var.woff2", weight: "400 650", style: "normal" },
    { path: "./fonts/SourceSerif4-Italic.woff2", weight: "420", style: "italic" },
  ],
  variable: "--font-ss4",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const hanken = localFont({
  src: "./fonts/HankenGrotesk-var.woff2",
  variable: "--font-hk",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: "Arial",
});

const title = `${profile.name} · ${profile.role}, ${profile.company}`;

// og:image, og:image:alt and twitter:image come from the file convention
// (app/opengraph-image.png + app/opengraph-image.alt.txt): Next emits them
// as long as neither `openGraph.images` nor `twitter.images` is set here.
export const metadata: Metadata = {
  metadataBase: new URL("https://zainn.me"),
  title: { default: title, template: `%s · ${profile.name}` },
  description: metaDescription,
  alternates: { canonical: "/" },
  openGraph: { title, description: metaDescription, type: "website", url: "/" },
  twitter: { card: "summary_large_image", title, description: metaDescription },
};

// One sheet, light only. An unseen system-dark theme is what killed an
// earlier round; there is no dark variant to fall into.
export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${hanken.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <div className="sheet">
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
