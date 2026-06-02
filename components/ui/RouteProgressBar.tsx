"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type ProgressState = "idle" | "loading" | "done";

function isInternalNavLink(anchor: HTMLAnchorElement, currentPath: string): boolean {
  if (anchor.target === "_blank") return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin && url.pathname + url.search !== currentPath;
  } catch {
    return href.startsWith("/");
  }
}

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPath =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
  const [state, setState] = useState<ProgressState>("idle");
  const hideTimerRef = useRef<number | undefined>(undefined);

  const start = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    setState("loading");
  }, []);

  const complete = useCallback(() => {
    setState((prev) => (prev === "loading" ? "done" : prev));
    hideTimerRef.current = window.setTimeout(() => setState("idle"), 450);
  }, []);

  useEffect(() => {
    complete();
  }, [currentPath, complete]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest("a");
      if (anchor instanceof HTMLAnchorElement && isInternalNavLink(anchor, currentPath)) {
        start();
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [currentPath, start]);

  useEffect(() => {
    return () => window.clearTimeout(hideTimerRef.current);
  }, []);

  if (state === "idle") return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden"
      role="progressbar"
      aria-label="Loading page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={state === "done" ? 100 : 70}
    >
      <div
        className={`h-full bg-sage-deep shadow-[0_0_8px_rgba(107,124,106,0.45)] transition-[width] duration-500 ease-out ${
          state === "loading" ? "w-[72%]" : "w-full"
        }`}
      />
    </div>
  );
}
