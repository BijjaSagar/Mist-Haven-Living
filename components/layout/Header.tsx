"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "@/components/Logo";
import { productCategories } from "@/data/products";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/manufacturing", label: "Manufacturing" },
  { href: "/certifications", label: "Certifications" },
  { href: "/private-label", label: "Private Label" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) {
      setMobileProductsOpen(false);
    }
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-hairline bg-pearl/95 shadow-sm backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-container items-center justify-between px-6 md:h-[4.75rem] md:px-8">
        <Logo priority />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          <div
            className="group relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-1 font-body text-sm text-taupe transition-colors hover:text-sage-deep"
            >
              Products
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  productsOpen && "rotate-180",
                )}
              />
            </Link>
            <div
              className={cn(
                "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-1",
                productsOpen
                  ? "pointer-events-auto visible opacity-100"
                  : "pointer-events-none invisible opacity-0",
              )}
            >
              <div className="w-[640px] border border-hairline bg-pearl p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {productCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products/${cat.slug}`}
                      className="block py-2 font-body text-sm text-taupe transition-colors hover:text-sage-deep"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/products"
                  className="mt-4 inline-block border-t border-hairline pt-4 font-body text-sm font-medium text-sage-deep"
                >
                  View all products →
                </Link>
              </div>
            </div>
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm text-taupe transition-colors hover:text-sage-deep"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link href="/contact#inquiry">Request Quote</Link>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-taupe lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent className="fixed inset-0 left-0 top-0 flex h-full max-h-[100dvh] max-w-none translate-x-0 translate-y-0 flex-col overflow-hidden border-0 bg-pearl p-0 data-[state=open]:animate-in data-[state=closed]:animate-out sm:max-w-none [&>button:last-child]:hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 items-center justify-between border-b border-hairline px-6 py-4">
              <DialogHeader className="sr-only">
                <DialogTitle>Navigation menu</DialogTitle>
              </DialogHeader>
              <Logo onNavigate={() => setMobileOpen(false)} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8"
              aria-label="Mobile"
            >
              <div className="border-b border-hairline">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 font-display text-2xl text-taupe"
                  onClick={() => setMobileProductsOpen((open) => !open)}
                  aria-expanded={mobileProductsOpen}
                  aria-controls="mobile-products-menu"
                >
                  Products
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 transition-transform",
                      mobileProductsOpen && "rotate-180",
                    )}
                  />
                </button>
                {mobileProductsOpen && (
                  <div
                    id="mobile-products-menu"
                    className="grid grid-cols-2 gap-2 pb-4"
                  >
                    {productCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products/${cat.slug}`}
                        className="py-2 font-body text-sm text-muted hover:text-sage-deep"
                        onClick={() => setMobileOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <Link
                      href="/products"
                      className="col-span-2 border-t border-hairline pt-4 font-body text-sm font-medium text-sage-deep"
                      onClick={() => setMobileOpen(false)}
                    >
                      View all products →
                    </Link>
                  </div>
                )}
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block border-b border-hairline py-4 font-display text-2xl text-taupe"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="shrink-0 border-t border-hairline p-6">
              <Button asChild className="w-full">
                <Link href="/contact#inquiry" onClick={() => setMobileOpen(false)}>
                  Request Quote
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
