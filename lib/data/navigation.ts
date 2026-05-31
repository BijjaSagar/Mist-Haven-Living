import { prisma, isDbConfigured } from "@/lib/db";
import type { NavigationItemData } from "@/lib/types/cms";

const STATIC_HEADER: NavigationItemData[] = [
  { id: "h1", label: "About", href: "/about", type: "link", sortOrder: 1, visible: true, location: "header" },
  { id: "h2", label: "Manufacturing", href: "/manufacturing", type: "link", sortOrder: 2, visible: true, location: "header" },
  { id: "h3", label: "Certifications", href: "/certifications", type: "link", sortOrder: 3, visible: true, location: "header" },
  { id: "h4", label: "Private Label", href: "/private-label", type: "link", sortOrder: 4, visible: true, location: "header" },
  { id: "h5", label: "FAQ", href: "/faq", type: "link", sortOrder: 5, visible: true, location: "header" },
  { id: "h6", label: "Contact", href: "/contact", type: "link", sortOrder: 6, visible: true, location: "header" },
];

const STATIC_FOOTER_COMPANY: NavigationItemData[] = [
  { id: "fc1", label: "About Us", href: "/about", type: "link", sortOrder: 1, visible: true, location: "footer_company" },
  { id: "fc2", label: "Manufacturing", href: "/manufacturing", type: "link", sortOrder: 2, visible: true, location: "footer_company" },
  { id: "fc3", label: "Certifications", href: "/certifications", type: "link", sortOrder: 3, visible: true, location: "footer_company" },
  { id: "fc4", label: "Private Label", href: "/private-label", type: "link", sortOrder: 4, visible: true, location: "footer_company" },
  { id: "fc5", label: "FAQ", href: "/faq", type: "link", sortOrder: 5, visible: true, location: "footer_company" },
  { id: "fc6", label: "Contact", href: "/contact", type: "link", sortOrder: 6, visible: true, location: "footer_company" },
];

const STATIC_FOOTER_EXPORT: NavigationItemData[] = [
  { id: "fe1", label: "All Products", href: "/products", type: "link", sortOrder: 1, visible: true, location: "footer_export" },
  { id: "fe2", label: "Request Quote", href: "/contact#inquiry", type: "link", sortOrder: 2, visible: true, location: "footer_export" },
];

function mapNav(
  row: {
    id: string;
    label: string;
    href: string;
    type: string;
    sortOrder: number;
    visible: boolean;
    location: string;
  },
): NavigationItemData {
  return {
    id: row.id,
    label: row.label,
    href: row.href,
    type: row.type as NavigationItemData["type"],
    sortOrder: row.sortOrder,
    visible: row.visible,
    location: row.location as NavigationItemData["location"],
  };
}

async function getNavByLocation(
  location: NavigationItemData["location"],
  fallback: NavigationItemData[],
): Promise<NavigationItemData[]> {
  if (!isDbConfigured()) return fallback;
  try {
    const rows = await prisma.navigationItem.findMany({
      where: { location, visible: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length === 0) return fallback;
    return rows.map(mapNav);
  } catch {
    return fallback;
  }
}

export async function getHeaderNav(): Promise<NavigationItemData[]> {
  return getNavByLocation("header", STATIC_HEADER);
}

export async function getFooterCompanyNav(): Promise<NavigationItemData[]> {
  return getNavByLocation("footer_company", STATIC_FOOTER_COMPANY);
}

export async function getFooterExportNav(): Promise<NavigationItemData[]> {
  return getNavByLocation("footer_export", STATIC_FOOTER_EXPORT);
}

export async function getAllNavigationAdmin(): Promise<NavigationItemData[]> {
  if (!isDbConfigured()) {
    return [...STATIC_HEADER, ...STATIC_FOOTER_COMPANY, ...STATIC_FOOTER_EXPORT];
  }
  try {
    const rows = await prisma.navigationItem.findMany({
      orderBy: [{ location: "asc" }, { sortOrder: "asc" }],
    });
    return rows.map(mapNav);
  } catch {
    return [...STATIC_HEADER, ...STATIC_FOOTER_COMPANY, ...STATIC_FOOTER_EXPORT];
  }
}

export { STATIC_HEADER, STATIC_FOOTER_COMPANY, STATIC_FOOTER_EXPORT };
