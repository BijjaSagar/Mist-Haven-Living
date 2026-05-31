import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "mist_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminSession = {
  id: string;
  email: string;
  role: string;
};

function getSecret(): Uint8Array {
  const secret =
    process.env.ADMIN_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "dev-admin-secret-change-me";
  return new TextEncoder().encode(secret);
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function hashAdminPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function validateAdminCredentials(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.adminUser.findUnique({
    where: { email: normalizedEmail },
  });

  if (user?.active) {
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return { id: user.id, email: user.email, role: user.role };
    }
    return null;
  }

  const userCount = await prisma.adminUser.count();
  if (userCount === 0) {
    const adminEmail = (
      process.env.ADMIN_EMAIL ?? "admin@example.com"
    ).toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? "admin";
    if (
      safeEqual(normalizedEmail, adminEmail) &&
      safeEqual(password, adminPassword)
    ) {
      return { id: "env", email: adminEmail, role: "admin" };
    }
  }

  return null;
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
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
