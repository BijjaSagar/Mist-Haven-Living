import Link from "next/link";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-md border border-dashed border-hairline bg-oat/40 px-6 py-12 text-center md:px-10 ${className}`}
      role="status"
    >
      <p className="font-body text-xs uppercase tracking-[0.22em] text-sage-deep">
        Nothing here yet
      </p>
      <h2 className="mt-3 font-display text-2xl text-taupe md:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-muted">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
