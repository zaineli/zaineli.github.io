import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Inter, DM_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import CursorFollow from "@/components/CursorFollow";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://zaineli.com"),
  title: {
    default: "Zain Ali · Product Engineer",
    template: "%s · Zain Ali",
  },
  description: profile.metaDescription,
  openGraph: {
    title: "Zain Ali · Product Engineer",
    description: profile.metaDescription,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

// No-FOUC theme bootstrap: set data-theme before paint from localStorage / system.
const themeScript = `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* No-JS fallback: scroll-reveal blocks ship hidden, so reveal them when JS is off. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <CursorFollow />
        <Nav />
        <main className="flex w-full flex-col items-center gap-[64px] pb-[64px] pt-[32px] md:gap-[96px] md:pb-[96px] md:pt-[64px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
