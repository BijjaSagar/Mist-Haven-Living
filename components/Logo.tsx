import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 682;
const LOGO_ALT = "Mist & Haven Living — Luxury in Every Thread";

type LogoProps = {
  className?: string;
  /** default: transparent logo for light surfaces; light: pearl logo for dark backgrounds */
  variant?: "default" | "light";
  priority?: boolean;
  onNavigate?: () => void;
};

export function Logo({
  className,
  variant = "default",
  priority = false,
  onNavigate,
}: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        "group inline-flex shrink-0 transition-opacity hover:opacity-90",
        className,
      )}
    >
      <Image
        src={variant === "light" ? "/logo-light.png" : "/logo.png"}
        alt={LOGO_ALT}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        className="h-auto w-[96px] sm:w-[108px] md:w-[118px]"
      />
    </Link>
  );
}

export const logoPath = "/logo.png";
