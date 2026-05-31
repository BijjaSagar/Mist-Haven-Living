import Link from "next/link";
import { Logo } from "@/components/Logo";
import { WaveDivider } from "@/components/WaveDivider";
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
  return (
    <footer className="relative bg-taupe text-pearl">
      <WaveDivider variant="pearl" className="absolute -top-8 left-0" />
      <div className="mx-auto max-w-container px-6 py-section-mobile md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo variant="light" logoLightUrl={logoLightUrl} siteName={siteName} />
            <p className="mt-1 font-body text-xs uppercase tracking-[0.22em] text-pearl/50">
              by {settings.legalName}
            </p>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-pearl/70">
              {settings.footerBlurb}
            </p>
          </div>

          <div>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage">
              Company
            </p>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-pearl/70 transition-colors hover:text-pearl"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage">
              Products
            </p>
            <ul className="space-y-3">
              {productCategories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="font-body text-sm text-pearl/70 transition-colors hover:text-pearl"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage">
              Export Office
            </p>
            <address className="not-italic">
              <p className="font-body text-sm text-pearl/70">
                {settings.address.street}
                <br />
                {settings.address.city}, {settings.address.region}{" "}
                {settings.address.postalCode}
                <br />
                {settings.address.country}
              </p>
              <p className="mt-4 font-body text-sm">
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="text-pearl/70 transition-colors hover:text-pearl"
                >
                  {settings.contactEmail}
                </a>
              </p>
              <p className="mt-2 font-body text-sm text-pearl/70">
                {settings.contactPhone}
              </p>
            </address>
            <ul className="mt-6 space-y-3">
              {exportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm font-medium text-sage transition-colors hover:text-pearl"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-pearl/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-xs text-pearl/50">
            © {new Date().getFullYear()}{" "}
            {settings.copyrightText ??
              `${settings.legalName}. All rights reserved.`}
          </p>
          <p className="font-body text-xs text-pearl/50">
            Export markets: {settings.exportMarkets}
          </p>
        </div>
      </div>
    </footer>
  );
}
