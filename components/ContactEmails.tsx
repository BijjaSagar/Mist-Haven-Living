import { cn } from "@/lib/utils";

type ContactEmailsProps = {
  primary: string;
  secondary?: string | null;
  className?: string;
  linkClassName?: string;
  layout?: "inline" | "stacked";
};

export function ContactEmails({
  primary,
  secondary,
  className,
  linkClassName,
  layout = "stacked",
}: ContactEmailsProps) {
  const emails = [primary, secondary?.trim()].filter(
    (email): email is string => Boolean(email),
  );

  if (emails.length === 0) return null;

  if (layout === "inline") {
    return (
      <span className={className}>
        {emails.map((email, index) => (
          <span key={email}>
            {index > 0 ? ", " : null}
            <a href={`mailto:${email}`} className={linkClassName}>
              {email}
            </a>
          </span>
        ))}
      </span>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {emails.map((email) => (
        <a
          key={email}
          href={`mailto:${email}`}
          className={cn("block", linkClassName)}
        >
          {email}
        </a>
      ))}
    </div>
  );
}
