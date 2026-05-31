import Link from "next/link";
import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminShell";
import { prisma, isDbConfigured } from "@/lib/db";
import {
  Package,
  Navigation,
  FileText,
  Settings,
  BarChart3,
  Award,
} from "lucide-react";

export default async function AdminDashboardPage() {
  await requireAdminPage();

  let counts = {
    products: 0,
    nav: 0,
    pages: 0,
    stats: 0,
    certs: 0,
  };

  if (isDbConfigured()) {
    try {
      const [products, nav, pages, stats, certs] = await Promise.all([
        prisma.productCategory.count(),
        prisma.navigationItem.count(),
        prisma.pageContent.count(),
        prisma.stat.count(),
        prisma.certification.count(),
      ]);
      counts = { products, nav, pages, stats, certs };
    } catch {
      // use zeros if DB unavailable
    }
  }

  const cards = [
    {
      href: "/admin/settings",
      label: "Site Settings",
      count: "Logo, colors, contact",
      icon: Settings,
    },
    {
      href: "/admin/products",
      label: "Products",
      count: `${counts.products} categories`,
      icon: Package,
    },
    {
      href: "/admin/navigation",
      label: "Navigation",
      count: `${counts.nav} links`,
      icon: Navigation,
    },
    {
      href: "/admin/pages",
      label: "Pages",
      count: `${counts.pages} pages`,
      icon: FileText,
    },
    {
      href: "/admin/stats",
      label: "Stats",
      count: `${counts.stats} items`,
      icon: BarChart3,
    },
    {
      href: "/admin/certifications",
      label: "Certifications",
      count: `${counts.certs} badges`,
      icon: Award,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Manage site content, products, branding, and navigation."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <AdminCard className="transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sage/30">
                    <Icon className="h-5 w-5 text-sage-deep" />
                  </div>
                  <div>
                    <p className="font-display text-lg text-taupe">
                      {card.label}
                    </p>
                    <p className="font-body text-sm text-muted">{card.count}</p>
                  </div>
                </div>
              </AdminCard>
            </Link>
          );
        })}
      </div>
    </>
  );
}
