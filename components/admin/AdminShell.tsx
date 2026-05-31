"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Navigation,
  Package,
  FileText,
  BarChart3,
  Award,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/navigation", label: "Navigation", icon: Navigation },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/stats", label: "Stats", icon: BarChart3 },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
];

type AdminShellProps = {
  children: React.ReactNode;
  email?: string;
};

export function AdminShell({ children, email }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-oat">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-hairline bg-pearl">
        <div className="border-b border-hairline px-6 py-5">
          <p className="font-display text-xl text-taupe">Mist CMS</p>
          {email && (
            <p className="mt-1 truncate font-body text-xs text-muted">{email}</p>
          )}
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 font-body text-sm transition-colors",
                  active
                    ? "bg-sage/30 text-taupe"
                    : "text-muted hover:bg-oat hover:text-taupe",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t border-hairline p-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Site
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-3xl text-taupe">{title}</h1>
      {description && (
        <p className="mt-2 font-body text-sm text-muted">{description}</p>
      )}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-hairline bg-pearl p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminSaveButton({
  saving,
  onClick,
  label = "Save changes",
}: {
  saving: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button onClick={onClick} disabled={saving}>
      {saving ? "Saving…" : label}
    </Button>
  );
}

export function AdminMessage({
  message,
  type,
}: {
  message: string | null;
  type: "success" | "error";
}) {
  if (!message) return null;
  return (
    <p
      className={cn(
        "mb-4 rounded-md px-4 py-2 font-body text-sm",
        type === "success"
          ? "bg-sage/20 text-sage-deep"
          : "bg-red-50 text-red-700",
      )}
    >
      {message}
    </p>
  );
}

export function jsonArrayField(
  value: string[],
  onChange: (v: string[]) => void,
): React.ReactNode {
  return (
    <textarea
      className="min-h-[100px] w-full rounded-md border border-hairline bg-white px-3 py-2 font-body text-sm"
      value={value.join("\n")}
      onChange={(e) =>
        onChange(
          e.target.value.split("\n").filter((line) => line.trim() !== ""),
        )
      }
      placeholder="One item per line"
    />
  );
}
