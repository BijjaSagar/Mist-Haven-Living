import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_WIDTH = 1024;
const LOGO_HEIGHT = 682;

type LogoProps = {
  className?: string;
  /** default: transparent logo for light surfaces; light: pearl logo for dark backgrounds */
  variant?: "default" | "light";
  priority?: boolean;
  onNavigate?: () => void;
  logoUrl?: string;
  logoLightUrl?: string;
  siteName?: string;
};

export function Logo({
  className,
  variant = "default",
  priority = false,
  onNavigate,
  logoUrl = "/logo.png",
  logoLightUrl = "/logo-light.png",
  siteName = "Mist & Haven Living",
}: LogoProps) {
  const src = variant === "light" ? logoLightUrl : logoUrl;
  const alt = `${siteName} — Luxury in Every Thread`;

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
        src={src}
        alt={alt}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        className="h-auto w-[96px] sm:w-[108px] md:w-[118px]"
      />
    </Link>
  );
}

export const logoPath = "/logo.png";
