import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  setAdminSessionCookie,
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

    const user = await validateAdminCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createAdminSession(user);
    await setAdminSessionCookie(token);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
