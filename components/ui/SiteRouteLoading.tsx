export function SiteRouteLoading() {
  return (
    <div
      className="mx-auto max-w-container px-6 pb-section-mobile md:px-8 md:pb-section-desktop"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading page"
    >
      {/* Hero skeleton — matches HeroSection layout */}
      <div className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="grid items-center gap-10 md:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="h-3 w-48 animate-pulse rounded bg-sand" />
            <div className="mt-6 h-14 max-w-lg animate-pulse rounded bg-sand md:h-[4.5rem]" />
            <div className="mt-4 h-4 max-w-xl animate-pulse rounded bg-oat" />
            <div className="mt-3 h-4 max-w-md animate-pulse rounded bg-oat" />
            <div className="mt-8 flex gap-3">
              <div className="h-12 w-36 animate-pulse rounded bg-sand" />
              <div className="h-12 w-32 animate-pulse rounded border border-hairline bg-oat" />
            </div>
          </div>
          <div className="order-1 aspect-[4/5] animate-pulse border border-hairline bg-oat lg:order-2" />
        </div>
      </div>

      {/* Trust strip placeholder */}
      <div className="flex flex-wrap justify-center gap-6 border-y border-hairline py-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-4 w-28 animate-pulse rounded bg-oat" />
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="mt-14">
        <div className="mx-auto h-3 w-32 animate-pulse rounded bg-sand" />
        <div className="mx-auto mt-4 h-10 max-w-md animate-pulse rounded bg-sand" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse border border-hairline bg-oat"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
