import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashAdminPassword } from "@/lib/auth/admin";
import { isUnauthorized, requireAdminRole } from "@/lib/admin/api-helpers";
import { updateAdminUserSchema } from "@/lib/validations/admin-users";
import { apiError, apiSuccess, apiZodError } from "@/lib/api-response";
import { withApiHandler, type RouteContext } from "@/lib/api-route";

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

export const PATCH = withApiHandler(
  async (request: NextRequest, context: RouteContext) => {
    const auth = await requireAdminRole();
    if (isUnauthorized(auth)) return auth;

    const { id } = await context.params;

    try {
      const body = await request.json();
      const parsed = updateAdminUserSchema.safeParse(body);
      if (!parsed.success) {
        return apiZodError(parsed.error);
      }

      const existing = await prisma.adminUser.findUnique({ where: { id } });
      if (!existing) {
        return apiError("User not found", 404, "NOT_FOUND");
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
            return apiError(
              "Cannot remove or deactivate the last admin user",
              400,
              "VALIDATION_ERROR",
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

      return apiSuccess(serializeAdminUser(user));
    } catch {
      return apiError("Failed to update user", 500, "UPDATE_FAILED");
    }
  },
);

export const DELETE = withApiHandler(
  async (_request: NextRequest, context: RouteContext) => {
    const auth = await requireAdminRole();
    if (isUnauthorized(auth)) return auth;

    const { id } = await context.params;

    try {
      const existing = await prisma.adminUser.findUnique({ where: { id } });
      if (!existing) {
        return apiError("User not found", 404, "NOT_FOUND");
      }

      if (existing.role === "admin" && existing.active) {
        const otherActiveAdmins = await countActiveAdmins(id);
        if (otherActiveAdmins === 0) {
          return apiError(
            "Cannot deactivate the last admin user",
            400,
            "VALIDATION_ERROR",
          );
        }
      }

      if (auth.id === id && existing.active) {
        return apiError(
          "You cannot deactivate your own account",
          400,
          "VALIDATION_ERROR",
        );
      }

      const user = await prisma.adminUser.update({
        where: { id },
        data: { active: false },
      });

      return apiSuccess(serializeAdminUser(user));
    } catch {
      return apiError("Failed to deactivate user", 500, "DEACTIVATE_FAILED");
    }
  },
);
