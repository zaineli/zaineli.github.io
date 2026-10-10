import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { metaDescription, profile } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// One family for everything: Geist, a self-hosted subset (wght 400–600).
// Geist has no Greek, so the write-ups' γ, τ and Δ fall to Source Serif 4,
// which loads only on a page that prints one.
const geist = localFont({
  src: "./fonts/Geist-var.woff2",
  variable: "--font-geist",
  weight: "400 600",
  display: "swap",
  adjustFontFallback: "Arial",
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
// (app/opengraph-image.png + app/opengraph-image.alt.txt).
export const metadata: Metadata = {
  metadataBase: new URL("https://zainn.me"),
  title: { default: title, template: `%s · ${profile.name}` },
  description: metaDescription,
  alternates: { canonical: "/" },
  openGraph: { title, description: metaDescription, type: "website", url: "/" },
  twitter: { card: "summary_large_image", title, description: metaDescription },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${backstop.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
