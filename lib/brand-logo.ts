const DEFAULT_LOGO = "/logo.png";
const DEFAULT_LOGO_LIGHT = "/logo-light.png";

export function hasCustomLogo(
  logoUrl?: string,
  logoLightUrl?: string,
  variant: "header" | "footer" = "header",
): boolean {
  if (variant === "footer") {
    return Boolean(logoLightUrl && logoLightUrl !== DEFAULT_LOGO_LIGHT);
  }
  return Boolean(logoUrl && logoUrl !== DEFAULT_LOGO);
}
