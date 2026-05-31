import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import type { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "mist_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminSession = {
  id: string;
  email: string;
  role: string;
};

export type CredentialResult =
  | { success: true; user: AdminSession }
  | { success: false; error: string };

export const ADMIN_SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ADMIN_SECRET or ADMIN_PASSWORD must be set in production",
      );
    }
    return new TextEncoder().encode("dev-admin-secret-change-me");
  }
  return new TextEncoder().encode(secret);
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** HTTPS detection for reverse proxies (e.g. Hostinger). */
export function isSecureAdminRequest(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() === "https";
  }
  return request.nextUrl.protocol === "https:";
}

export function applyAdminSessionCookie(
  response: NextResponse,
  token: string,
  secure: boolean,
): void {
  response.cookies.set(COOKIE_NAME, token, {
    ...ADMIN_SESSION_COOKIE_OPTIONS,
    secure,
  });
}

export function clearAdminSessionOnResponse(
  response: NextResponse,
  secure: boolean,
): void {
  response.cookies.set(COOKIE_NAME, "", {
    ...ADMIN_SESSION_COOKIE_OPTIONS,
    secure,
    maxAge: 0,
  });
}

export async function hashAdminPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function tryEnvCredentials(
  normalizedEmail: string,
  password: string,
): Promise<AdminSession | null> {
  const adminEmail = (
    process.env.ADMIN_EMAIL ?? "admin@mistandhaven.com"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";
  const hasExplicitEnv = Boolean(
    process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD,
  );

  if (
    !safeEqual(normalizedEmail, adminEmail) ||
    !safeEqual(password, adminPassword)
  ) {
    return null;
  }

  try {
    const userCount = await prisma.adminUser.count();
    if (hasExplicitEnv || userCount === 0) {
      return { id: "env", email: adminEmail, role: "admin" };
    }
  } catch (err) {
    console.error("tryEnvCredentials DB error:", err);
    throw err;
  }

  return null;
}

export async function validateAdminCredentials(
  email: string,
  password: string,
): Promise<CredentialResult> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      if (!user.active) {
        const envUser = await tryEnvCredentials(normalizedEmail, password);
        if (envUser) return { success: true, user: envUser };
        return {
          success: false,
          error: "This account is disabled. Contact an administrator.",
        };
      }

      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        return {
          success: true,
          user: { id: user.id, email: user.email, role: user.role },
        };
      }

      const envUser = await tryEnvCredentials(normalizedEmail, password);
      if (envUser) return { success: true, user: envUser };

      return { success: false, error: "Invalid email or password." };
    }

    const envUser = await tryEnvCredentials(normalizedEmail, password);
    if (envUser) return { success: true, user: envUser };

    const userCount = await prisma.adminUser.count();
    if (userCount === 0) {
      return {
        success: false,
        error:
          "No admin users in database. Set ADMIN_EMAIL and ADMIN_PASSWORD, or run: npm run db:seed",
      };
    }

    return { success: false, error: "Invalid email or password." };
  } catch (err) {
    console.error("validateAdminCredentials DB error:", err);
    throw err;
  }
}

export async function createAdminSession(user: AdminSession): Promise<string> {
  return new SignJWT({ sub: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifyAdminSession(
  token: string,
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload.role;
    if (
      (role !== "admin" && role !== "editor") ||
      typeof payload.email !== "string" ||
      typeof payload.sub !== "string"
    ) {
      return null;
    }
    return {
      id: payload.sub,
      email: payload.email,
      role,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminSession(token);
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    ...ADMIN_SESSION_COOKIE_OPTIONS,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
