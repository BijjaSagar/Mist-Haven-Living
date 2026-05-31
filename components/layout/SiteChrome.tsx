import { HeaderWrapper } from "@/components/layout/HeaderWrapper";
import { FooterWrapper } from "@/components/layout/FooterWrapper";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export async function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderWrapper />
      <main className="flex-1">{children}</main>
      <FooterWrapper />
      <WhatsAppButton />
    </>
  );
}
