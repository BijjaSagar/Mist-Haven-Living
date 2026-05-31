import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { NavigationEditor } from "@/components/admin/NavigationEditor";
import { getAllNavigationAdmin } from "@/lib/data/navigation";

export default async function AdminNavigationPage() {
  await requireAdminPage();
  const items = await getAllNavigationAdmin();

  return (
    <>
      <AdminPageHeader
        title="Navigation"
        description="Manage header and footer menu links."
      />
      <NavigationEditor initial={items} />
    </>
  );
}
