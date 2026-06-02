"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type SiteRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function SiteRouteError({ error, reset }: SiteRouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 pt-28 text-center md:pt-32">
      <p className="font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
        Something went wrong
      </p>
      <h1 className="mt-4 font-display text-4xl text-taupe">
        We couldn&apos;t load this page
      </h1>
      <p className="mt-4 max-w-md font-body text-muted">
        Please try again. If the problem continues, contact our export team from
        the contact page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </section>
  );
}
