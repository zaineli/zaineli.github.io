import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { metaDescription, profile } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/*
 * One family for everything: Archivo, variable in weight (250–600), cut
 * for this site (see docs/type.md). Light for anything large, regular for
 * anything you read. Archivo has no Greek, so the write-ups' γ and τ fall
 * to a Source Serif 4 backstop that loads only on a page that prints one.
 */
const archivo = localFont({
  src: "./fonts/archivo.woff2",
  variable: "--font-archivo",
  weight: "250 600",
  display: "swap",
  adjustFontFallback: "Arial",
});

const backstop = localFont({
  src: "./fonts/serif-text.woff2",
  variable: "--font-backstop",
  weight: "380 620",
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
  themeColor: "#e7e7e1",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${backstop.variable}`}>
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
