import { NextRequest } from "next/server";
import {
  applyAdminSessionCookie,
  createAdminSession,
  isSecureAdminRequest,
  validateAdminCredentials,
} from "@/lib/auth/admin";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return apiError("Email and password required", 400, "VALIDATION_ERROR");
    }

    let result;
    try {
      result = await validateAdminCredentials(email, password);
    } catch (err) {
      console.error("Admin login database error:", err);
      return apiError("Database unavailable", 503, "DATABASE_UNAVAILABLE");
    }

    if (!result.success) {
      const status = result.error.includes("No admin users") ? 503 : 401;
      const code = status === 503 ? "ADMIN_NOT_CONFIGURED" : "INVALID_CREDENTIALS";
      return apiError(result.error, status, code);
    }

    const token = await createAdminSession(result.user);
    const response = apiSuccess({ loggedIn: true });
    applyAdminSessionCookie(
      response,
      token,
      isSecureAdminRequest(request),
    );
    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return apiError("Login failed", 500, "LOGIN_FAILED");
  }
}
