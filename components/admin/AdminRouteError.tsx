"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type AdminRouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function AdminRouteError({ error, reset }: AdminRouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="mx-auto max-w-lg p-6 md:p-8"
      role="alert"
    >
      <p className="font-body text-xs uppercase tracking-[0.14em] text-muted">
        Admin error
      </p>
      <h1 className="mt-2 font-display text-2xl text-taupe">
        Could not load this section
      </h1>
      <p className="mt-3 font-body text-sm text-muted">
        Save your work elsewhere if needed, then try again. Persistent errors may
        indicate a server or database issue.
      </p>
      <Button type="button" className="mt-6" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
