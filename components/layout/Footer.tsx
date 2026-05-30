import Link from "next/link";
import { siteConfig } from "@/lib/utils";
import { productCategories } from "@/data/products";
import { Logo } from "@/components/Logo";
import { WaveDivider } from "@/components/WaveDivider";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/manufacturing", label: "Manufacturing" },
    { href: "/certifications", label: "Certifications" },
    { href: "/private-label", label: "Private Label" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  export: [
    { href: "/products", label: "All Products" },
    { href: "/contact#inquiry", label: "Request Quote" },
  ],
};

export function Footer() {
  return (
    <footer className="relative bg-taupe text-pearl">
      <WaveDivider variant="pearl" className="absolute -top-8 left-0" />
      <div className="mx-auto max-w-container px-6 py-section-mobile md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo variant="light" />
            <p className="mt-1 font-body text-xs uppercase tracking-[0.22em] text-pearl/50">
              by {siteConfig.legalName}
            </p>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-pearl/70">
              Premium textile manufacturing for hospitality, retail, and private
              label buyers across the USA and Canada.
            </p>
          </div>

          <div>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.22em] text-sage">
              Company
            </p>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
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
                {siteConfig.address.street}
                <br />
                {siteConfig.address.city}, {siteConfig.address.region}{" "}
                {siteConfig.address.postalCode}
                <br />
                {siteConfig.address.country}
              </p>
              <p className="mt-4 font-body text-sm">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-pearl/70 transition-colors hover:text-pearl"
                >
                  {siteConfig.email}
                </a>
              </p>
              <p className="mt-2 font-body text-sm text-pearl/70">
                {siteConfig.phone}
              </p>
            </address>
            <ul className="mt-6 space-y-3">
              {footerLinks.export.map((link) => (
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
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="font-body text-xs text-pearl/50">
            Export markets: USA · Canada
          </p>
        </div>
      </div>
    </footer>
  );
}
