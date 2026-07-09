import type { Metadata, Viewport } from "next";
import { Kavoon, Rozha_One, Vollkorn, IBM_Plex_Mono } from "next/font/google";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { DEFAULT_HOURS } from "@/lib/constants";
import "./globals.css";
import { SiteChrome } from "@/components/layout/site-chrome";

const kavoon = Kavoon({
  variable: "--font-kavoon",
  weight: "400",
  subsets: ["latin"],
});

const rozhaOne = Rozha_One({
  variable: "--font-rozha",
  weight: "400",
  subsets: ["latin"],
});

const vollkorn = Vollkorn({
  variable: "--font-vollkorn",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const SITE_NAME = "Kopitiam Tjoa";
const SITE_DESCRIPTION =
  "Kopi yang sama sejak gerobak pertama. Kopitiam Tjoa, Jalan Kembang Jepun, Surabaya, sejak 1968.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kopitiamtjoa.id"), // TODO: set real production domain
  title: {
    default: `${SITE_NAME}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME}, est. 1968`,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "id_ID",
    type: "website",
    // images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME}, est. 1968`,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#f2ead9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      className={`${kavoon.variable} ${rozhaOne.variable} ${vollkorn.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex h-full min-h-full flex-col bg-kopi-bg font-body text-kopi-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-kopi-ink focus:bg-kopi-bg focus:px-4 focus:py-2 focus:font-body focus:text-sm focus:font-semibold focus:text-kopi-ink"
        >
          Langsung ke konten utama
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
