import Link from "next/link";
import { Logo } from "@/components/Logo";
import type {
  NavigationItemData,
  ProductCategoryData,
  SiteSettingsData,
} from "@/lib/types/cms";

type FooterProps = {
  settings: SiteSettingsData;
  companyLinks: NavigationItemData[];
  exportLinks: NavigationItemData[];
  productCategories: ProductCategoryData[];
  logoLightUrl?: string;
  siteName?: string;
};

export function Footer({
  settings,
  companyLinks,
  exportLinks,
  productCategories,
  logoLightUrl,
  siteName,
}: FooterProps) {
  const certLabels = ["ISO 9001:2015", "OEKO-TEX®", "BCI-Aligned"];

  return (
    <footer className="relative bg-taupe-dark text-pearl">
      <div className="mx-auto max-w-container px-6 py-section-mobile md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-10">
          <div>
            <Logo variant="light" logoLightUrl={logoLightUrl} siteName={siteName} />
            <p className="mt-1 font-body text-xs uppercase tracking-[0.22em] text-pearl/50">
              by {settings.legalName}
            </p>
            <p className="mt-4 max-w-xs font-body text-[13.5px] leading-relaxed text-pearl/60">
              {settings.footerBlurb}
            </p>
          </div>

          <div>
            <p className="mb-4 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
              Explore
            </p>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-[13.5px] text-pearl/70 transition-colors hover:text-pearl"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
              Products
            </p>
            <ul className="space-y-3">
              {productCategories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="font-body text-[13.5px] text-pearl/70 transition-colors hover:text-pearl"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-sage">
              Contact
            </p>
            <address className="not-italic">
              <p className="font-body text-[13.5px] text-pearl/70">
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="transition-colors hover:text-pearl"
                >
                  {settings.contactEmail}
                </a>
              </p>
              <p className="mt-3 font-body text-[13.5px] text-pearl/70">
                {settings.contactPhone}
              </p>
              <p className="mt-3 font-body text-[13.5px] text-pearl/70">
                {settings.address.city}, {settings.address.region},{" "}
                {settings.address.country}
              </p>
            </address>
            <ul className="mt-6 space-y-3">
              {exportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-[13.5px] font-medium text-sage transition-colors hover:text-pearl"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-pearl/15 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-xs text-pearl/50">
            © {new Date().getFullYear()}{" "}
            {settings.copyrightText ??
              `${settings.siteName}. Luxury in Every Thread.`}
          </p>
          <div className="flex flex-wrap gap-4 font-body text-xs text-pearl/50 md:gap-5">
            {certLabels.map((cert) => (
              <span key={cert}>{cert}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
