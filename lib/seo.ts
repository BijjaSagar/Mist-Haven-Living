import type { Metadata } from "next";
import { siteConfig } from "@/lib/utils";

const logoUrl = `${siteConfig.url}/logo.png`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function createMetadata({
  title,
  description,
  path,
  image,
}: PageMeta): Metadata {
  const fullTitle =
    title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? `${siteConfig.url}/og-default.jpg`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    icons: {
      icon: [
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: logoUrl,
    image: logoUrl,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: "IN",
    },
    areaServed: siteConfig.exportMarkets.map((market) => ({
      "@type": "Country",
      name: market,
    })),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: siteConfig.exportMarkets,
    url: `${siteConfig.url}${path}`,
  };
}

export function productJsonLd(
  name: string,
  description: string,
  slug: string,
  image: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    manufacturer: {
      "@type": "Organization",
      name: siteConfig.legalName,
    },
    url: `${siteConfig.url}/products/${slug}`,
  };
}

type FaqItem = {
  question: string;
  answer: string;
};

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
