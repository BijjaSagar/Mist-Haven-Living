import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { getThemeStyle } from "@/components/layout/HeaderWrapper";
import { createMetadata, organizationJsonLd } from "@/lib/seo";
import { getPageContent } from "@/lib/data/pages";
import { getSiteSettings } from "@/lib/data/site-settings";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([
    getPageContent("home"),
    getSiteSettings(),
  ]);
  return createMetadata({
    title: page?.metaTitle ?? settings.siteName,
    description: page?.metaDescription ?? settings.description,
    path: "/",
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeStyle = await getThemeStyle();

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
      </head>
      <body
        className="min-h-screen antialiased bg-paper-texture"
        style={themeStyle}
      >
        {children}
      </body>
    </html>
  );
}
