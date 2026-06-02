import { NextRequest } from "next/server";
import {
  clearAdminSessionOnResponse,
  isSecureAdminRequest,
} from "@/lib/auth/admin";
import { apiSuccess } from "@/lib/api-response";
import { withApiHandler } from "@/lib/api-route";

export const POST = withApiHandler(async (request: NextRequest) => {
  const response = apiSuccess({ loggedOut: true });
  clearAdminSessionOnResponse(response, isSecureAdminRequest(request));
  return response;
});
