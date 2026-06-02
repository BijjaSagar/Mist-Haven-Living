export type ProductSize = {
  label: string;
  cm: string;
  inches: string;
};

export type ProductCategoryData = {
  slug: string;
  name: string;
  metaTitle: string | null;
  metaDescription: string | null;
  shortDescription: string;
  description: string;
  eyebrow: string;
  heroImage: string;
  cardImage: string;
  galleryImages: string[];
  features: string[];
  materials: string[];
  sizes: ProductSize[];
  gsmRange: string;
  customization: string[];
  packaging: string[];
  idealFor: string[];
  leadTime: string;
  moq: string;
};

export type SiteColors = {
  pearl: string;
  oat: string;
  taupe: string;
  muted: string;
  sage: string;
  sageDeep: string;
  hairline: string;
};

export type SiteSettingsData = {
  siteName: string;
  legalName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  logoLightUrl: string;
  faviconUrl: string | null;
  colors: SiteColors;
  contactEmail: string;
  contactEmailSecondary: string | null;
  contactPhone: string;
  leadsToEmail: string | null;
  resendFromEmail: string | null;
  inquiryEnabled: boolean;
  whatsappNumber: string | null;
  calendlyUrl: string | null;
  footerBlurb: string;
  copyrightText: string | null;
  exportMarkets: string;
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
  };
};

export type NavigationItemData = {
  id: string;
  label: string;
  href: string;
  type: "link" | "products_dropdown";
  sortOrder: number;
  visible: boolean;
  location:
    | "header"
    | "footer_company"
    | "footer_products"
    | "footer_export";
};

export type StatData = {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
  visible: boolean;
};

export type CertificationData = {
  id: string;
  name: string;
  code: string | null;
  description: string;
  pdfUrl: string | null;
  sortOrder: number;
  visible: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type HeroSlide = {
  imageUrl: string;
  caption: string;
};

export type PageHeroSection = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  slides?: HeroSlide[];
};

export type PageContentData = {
  slug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  sections: Record<string, unknown>;
};
