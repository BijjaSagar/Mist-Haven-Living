import { NextRequest } from "next/server";
import {
  applyAdminSessionCookie,
  createAdminSession,
  isSecureAdminRequest,
  validateAdminCredentials,
} from "@/lib/auth/admin";
import { apiError, apiSuccess, apiValidationError } from "@/lib/api-response";
import { withApiHandler } from "@/lib/api-route";

export const POST = withApiHandler(async (request: NextRequest) => {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return apiValidationError("Email and password required", {
        fieldErrors: {
          ...(!email ? { email: ["Required"] } : {}),
          ...(!password ? { password: ["Required"] } : {}),
        },
        formErrors: [],
      });
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
});
