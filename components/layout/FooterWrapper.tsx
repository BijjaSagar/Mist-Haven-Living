import { getSiteSettings } from "@/lib/data/site-settings";
import {
  getFooterCompanyNav,
  getFooterExportNav,
} from "@/lib/data/navigation";
import { getProductCategories } from "@/lib/data/products";
import { Footer } from "./Footer";

export async function FooterWrapper() {
  const [settings, companyLinks, exportLinks, productCategories] =
    await Promise.all([
      getSiteSettings(),
      getFooterCompanyNav(),
      getFooterExportNav(),
      getProductCategories(),
    ]);

  return (
    <Footer
      settings={settings}
      companyLinks={companyLinks}
      exportLinks={exportLinks}
      productCategories={productCategories}
      logoLightUrl={settings.logoLightUrl}
      siteName={settings.siteName}
    />
  );
}
