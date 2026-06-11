import Image from "next/image";
import Link from "next/link";
import { resolveCmsImage, type CacheVersion } from "@/lib/image-props";
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
  /** DB updatedAt — busts cache for static `/logo.png` paths after settings save. */
  logoCacheVersion?: CacheVersion;
};

export function Logo({
  className,
  variant = "default",
  priority = false,
  onNavigate,
  logoUrl = "/logo.png",
  logoLightUrl = "/logo-light.png",
  siteName = "Mist & Haven Living",
  logoCacheVersion,
}: LogoProps) {
  const src = variant === "light" ? logoLightUrl : logoUrl;
  const alt = `${siteName} — Luxury in Every Thread`;
  const imageProps = resolveCmsImage(src, logoCacheVersion);

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
        alt={alt}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        {...imageProps}
        className="h-auto w-[96px] sm:w-[108px] md:w-[118px]"
      />
    </Link>
  );
}

export const logoPath = "/logo.png";
