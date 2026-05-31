import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { StatsEditor } from "@/components/admin/StatsEditor";
import { getAllStatsAdmin } from "@/lib/data/stats";

export default async function AdminStatsPage() {
  await requireAdminPage();
  const stats = await getAllStatsAdmin();

  return (
    <>
      <AdminPageHeader
        title="Stats"
        description="Manage the stat strip on home and about pages."
      />
      <StatsEditor initial={stats} />
    </>
  );
}
