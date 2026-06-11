import { getSiteSettings, colorsToCssVars } from "@/lib/data/site-settings";
import { getHeaderNav } from "@/lib/data/navigation";
import { getProductCategories } from "@/lib/data/products";
import { Header } from "./Header";

export async function HeaderWrapper() {
  const [settings, navLinks, productCategories] = await Promise.all([
    getSiteSettings(),
    getHeaderNav(),
    getProductCategories(),
  ]);

  return (
    <Header
      navLinks={navLinks}
      productCategories={productCategories}
      logoUrl={settings.logoUrl}
      logoLightUrl={settings.logoLightUrl}
      siteName={settings.siteName}
      logoCacheVersion={settings.updatedAt}
    />
  );
}

export async function getThemeStyle(): Promise<React.CSSProperties> {
  const settings = await getSiteSettings();
  return colorsToCssVars(settings.colors) as React.CSSProperties;
}
