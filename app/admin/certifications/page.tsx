import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { CertificationsEditor } from "@/components/admin/CertificationsEditor";
import { getAllCertificationsAdmin } from "@/lib/data/certifications";

export default async function AdminCertificationsPage() {
  await requireAdminPage();
  const certs = await getAllCertificationsAdmin();

  return (
    <>
      <AdminPageHeader
        title="Certifications"
        description="Manage compliance badges and certificate PDFs."
      />
      <CertificationsEditor initial={certs} />
    </>
  );
}
