import { cn } from "@/lib/utils";

export function InquiryUnavailable({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <p
      className={cn(
        "font-body text-sm leading-relaxed",
        isDark ? "text-pearl/80" : "text-muted",
        className,
      )}
    >
      Online inquiries are temporarily unavailable. Please email us directly or
      call the export office — we respond within one business day.
    </p>
  );
}
