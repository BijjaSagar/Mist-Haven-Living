import { NextRequest, NextResponse } from "next/server";
import {
  applyAdminSessionCookie,
  createAdminSession,
  isSecureAdminRequest,
  validateAdminCredentials,
} from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    let result;
    try {
      result = await validateAdminCredentials(email, password);
    } catch (err) {
      console.error("Admin login database error:", err);
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 },
      );
    }

    if (!result.success) {
      const status = result.error.includes("No admin users") ? 503 : 401;
      return NextResponse.json({ error: result.error }, { status });
    }

    const token = await createAdminSession(result.user);
    const response = NextResponse.json({ success: true });
    applyAdminSessionCookie(
      response,
      token,
      isSecureAdminRequest(request),
    );
    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
