import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteChrome } from "@/components/layout/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-28 text-center md:pt-32">
        <p className="font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl text-taupe">Page not found</h1>
        <p className="mt-4 max-w-md font-body text-muted">
          The page you are looking for may have been moved or does not exist.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return home</Link>
        </Button>
      </section>
    </SiteChrome>
  );
}
