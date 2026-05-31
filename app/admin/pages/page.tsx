import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { PagesEditor } from "@/components/admin/PagesEditor";
import { getAllPagesAdmin } from "@/lib/data/pages";

export default async function AdminPagesPage() {
  await requireAdminPage();
  const pages = await getAllPagesAdmin();

  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Edit page content, hero sections, and metadata."
      />
      <PagesEditor initial={pages} />
    </>
  );
}
