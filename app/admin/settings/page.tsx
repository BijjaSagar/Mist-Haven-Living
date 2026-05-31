import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/data/site-settings";

export default async function AdminSettingsPage() {
  await requireAdminPage();
  const settings = await getSiteSettings();

  return (
    <>
      <AdminPageHeader
        title="Site Settings"
        description="Logo, colors, contact info, and footer content."
      />
      <SettingsForm initial={settings} />
    </>
  );
}
