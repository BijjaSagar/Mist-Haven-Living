export function AdminRouteLoading() {
  return (
    <div
      className="space-y-6 p-6 md:p-8"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading admin page"
    >
      <div className="h-8 w-48 animate-pulse rounded bg-sand" />
      <div className="h-4 w-72 animate-pulse rounded bg-oat" />
      <div className="rounded-md border border-hairline bg-white p-6">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-oat" />
          ))}
        </div>
      </div>
    </div>
  );
}
