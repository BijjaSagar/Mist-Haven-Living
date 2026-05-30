import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 682;
const LOGO_ALT = "Mist & Haven Living — Luxury in Every Thread";

type LogoProps = {
  className?: string;
  /** default: header / light surfaces; card: pearl pill for dark backgrounds */
  variant?: "default" | "card";
  priority?: boolean;
  onNavigate?: () => void;
};

export function Logo({
  className,
  variant = "default",
  priority = false,
  onNavigate,
}: LogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt={LOGO_ALT}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={cn(
        "h-auto w-[118px] sm:w-[140px] md:w-[160px] lg:w-[175px]",
        variant === "card" && "w-[150px] md:w-[175px]",
      )}
    />
  );

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        "group inline-flex shrink-0 transition-opacity hover:opacity-90",
        className,
      )}
    >
      {variant === "card" ? (
        <span className="inline-flex rounded-sm bg-pearl px-4 py-3 shadow-lg ring-1 ring-pearl/30">
          {image}
        </span>
      ) : (
        image
      )}
    </Link>
  );
}

export const logoPath = "/logo.png";
