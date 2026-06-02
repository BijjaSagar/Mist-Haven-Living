import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { InquiriesEditor } from "@/components/admin/InquiriesEditor";
import { getAllInquiriesAdmin } from "@/lib/data/inquiries";

export default async function AdminInquiriesPage() {
  await requireAdminPage();
  const inquiries = await getAllInquiriesAdmin();

  return (
    <>
      <AdminPageHeader
        title="Inquiries"
        description="B2B quote requests and catalog download leads from the website."
      />
      <InquiriesEditor initial={inquiries} />
    </>
  );
}
