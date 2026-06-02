export function SiteRouteLoading() {
  return (
    <div
      className="mx-auto max-w-container px-6 pt-32 pb-section-mobile md:px-8 md:pb-section-desktop"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="h-3 w-28 animate-pulse rounded bg-sand" />
      <div className="mt-6 h-12 max-w-xl animate-pulse rounded bg-sand md:h-14" />
      <div className="mt-4 h-4 max-w-2xl animate-pulse rounded bg-oat" />
      <div className="mt-3 h-4 max-w-xl animate-pulse rounded bg-oat" />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] animate-pulse border border-hairline bg-oat"
          />
        ))}
      </div>
    </div>
  );
}
