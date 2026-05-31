import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashAdminPassword } from "@/lib/auth/admin";
import { isUnauthorized, requireAdminRole } from "@/lib/admin/api-helpers";
import { createAdminUserSchema } from "@/lib/validations/admin-users";

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

export async function GET() {
  const auth = await requireAdminRole();
  if (isUnauthorized(auth)) return auth;

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(users.map(serializeAdminUser));
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminRole();
  if (isUnauthorized(auth)) return auth;

  try {
    const body = await request.json();
    const parsed = createAdminUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await hashAdminPassword(parsed.data.password);
    const user = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name: parsed.data.name?.trim() || null,
        role: parsed.data.role,
        active: true,
      },
    });

    return NextResponse.json(serializeAdminUser(user), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
