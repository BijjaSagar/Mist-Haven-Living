import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashAdminPassword } from "@/lib/auth/admin";
import { isUnauthorized, requireAdminRole } from "@/lib/admin/api-helpers";
import { createAdminUserSchema } from "@/lib/validations/admin-users";
import { apiError, apiSuccess, apiZodError, listMeta } from "@/lib/api-response";
import { withApiHandler } from "@/lib/api-route";

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

export const GET = withApiHandler(async () => {
  const auth = await requireAdminRole();
  if (isUnauthorized(auth)) return auth;

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
  });

  const data = users.map(serializeAdminUser);
  return apiSuccess(data, { meta: listMeta(data) });
});

export const POST = withApiHandler(async (request: NextRequest) => {
  const auth = await requireAdminRole();
  if (isUnauthorized(auth)) return auth;

  const body = await request.json();
  const parsed = createAdminUserSchema.safeParse(body);
  if (!parsed.success) {
    return apiZodError(parsed.error);
  }

  try {
    const email = parsed.data.email.trim().toLowerCase();
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      return apiError(
        "A user with this email already exists",
        409,
        "CONFLICT",
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

    return apiSuccess(serializeAdminUser(user), { status: 201 });
  } catch {
    return apiError("Failed to create user", 500, "CREATE_FAILED");
  }
});
