import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return <LoginForm />;
}
