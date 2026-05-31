import { redirect } from "next/navigation";
import { requireAdminPage } from "@/app/admin/layout";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { UsersEditor } from "@/components/admin/UsersEditor";
import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const session = await requireAdminPage();

  if (session.role !== "admin") {
    redirect("/admin");
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
  });

  const initial = users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }));

  return (
    <>
      <AdminPageHeader
        title="Users"
        description="Create and manage CMS admin and editor accounts."
      />
      <UsersEditor initial={initial} />
    </>
  );
}
