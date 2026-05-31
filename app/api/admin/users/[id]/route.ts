import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashAdminPassword } from "@/lib/auth/admin";
import { isUnauthorized, requireAdminRole } from "@/lib/admin/api-helpers";
import { updateAdminUserSchema } from "@/lib/validations/admin-users";

type RouteContext = { params: Promise<{ id: string }> };

function serializeAdminUser(user: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

async function countActiveAdmins(excludeId?: string): Promise<number> {
  return prisma.adminUser.count({
    where: {
      role: "admin",
      active: true,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireAdminRole();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const body = await request.json();
    const parsed = updateAdminUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const existing = await prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nextRole = parsed.data.role ?? existing.role;
    const nextActive =
      parsed.data.active !== undefined ? parsed.data.active : existing.active;

    if (existing.role === "admin" && existing.active) {
      const wouldRemoveAdmin =
        nextRole !== "admin" || nextActive === false;
      if (wouldRemoveAdmin) {
        const otherActiveAdmins = await countActiveAdmins(id);
        if (otherActiveAdmins === 0) {
          return NextResponse.json(
            { error: "Cannot remove or deactivate the last admin user" },
            { status: 400 },
          );
        }
      }
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data: {
        ...(parsed.data.name !== undefined
          ? { name: parsed.data.name?.trim() || null }
          : {}),
        ...(parsed.data.role !== undefined ? { role: parsed.data.role } : {}),
        ...(parsed.data.active !== undefined
          ? { active: parsed.data.active }
          : {}),
        ...(parsed.data.password
          ? { password: await hashAdminPassword(parsed.data.password) }
          : {}),
      },
    });

    return NextResponse.json(serializeAdminUser(user));
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdminRole();
  if (isUnauthorized(auth)) return auth;

  const { id } = await context.params;

  try {
    const existing = await prisma.adminUser.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existing.role === "admin" && existing.active) {
      const otherActiveAdmins = await countActiveAdmins(id);
      if (otherActiveAdmins === 0) {
        return NextResponse.json(
          { error: "Cannot deactivate the last admin user" },
          { status: 400 },
        );
      }
    }

    if (auth.id === id && existing.active) {
      return NextResponse.json(
        { error: "You cannot deactivate your own account" },
        { status: 400 },
      );
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json(serializeAdminUser(user));
  } catch {
    return NextResponse.json({ error: "Failed to deactivate user" }, { status: 500 });
  }
}
