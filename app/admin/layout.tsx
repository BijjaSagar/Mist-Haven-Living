import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return session ? (
    <AdminShell email={session.email}>{children}</AdminShell>
  ) : (
    <>{children}</>
  );
}

export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
