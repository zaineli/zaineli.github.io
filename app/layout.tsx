import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { metaDescription, profile } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// One voice, two optical sizes, and a grotesk for what is measured.
// Newsreader is cut twice from its variable master: a display instance
// (opsz 60, light to medium) for the opening, the names and the numbers,
// and a text instance (opsz 16) for every sentence a reader reads. Both are
// self-hosted subsets. Newsreader has no arrows, no Δ and no Greek, so
// Source Serif 4 stands behind it — loaded only on a page that prints one.
const display = localFont({
  src: [
    { path: "./fonts/NR-Display.woff2", weight: "300 500", style: "normal" },
    { path: "./fonts/NR-DisplayItalic.woff2", weight: "300 400", style: "italic" },
  ],
  variable: "--font-nrd",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const text = localFont({
  src: [
    { path: "./fonts/NR-Text.woff2", weight: "400 600", style: "normal" },
    { path: "./fonts/NR-TextItalic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-nrt",
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

// Arrows come from the grotesk at the weight of the text around them, so
// "45 → 13" in a light numeral gets a light arrow.
const arrows = localFont({
  src: "./fonts/HankenGrotesk-var.woff2",
  variable: "--font-arw",
  weight: "100 900",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+2190-21FF" }],
});

const backstop = localFont({
  src: "./fonts/SourceSerif4-var.woff2",
  variable: "--font-ss4",
  weight: "400 650",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
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

// One sheet, light only.
export const viewport: Viewport = {
  themeColor: "#fafaf8",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${hanken.variable} ${arrows.variable} ${backstop.variable}`}>
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
