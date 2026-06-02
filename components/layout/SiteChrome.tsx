import { Suspense } from "react";
import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { FooterWrapper } from "@/components/layout/FooterWrapper";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import { getSiteSettings } from "@/lib/data/site-settings";

export async function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const whatsappNumber =
    settings.whatsappNumber ??
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
    null;

  return (
    <>
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      <HeaderWrapper />
      <main className="flex-1">{children}</main>
      <FooterWrapper />
      <WhatsAppButton number={whatsappNumber} />
    </>
  );
}
