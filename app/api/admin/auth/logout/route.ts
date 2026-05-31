import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSessionOnResponse,
  isSecureAdminRequest,
} from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  clearAdminSessionOnResponse(response, isSecureAdminRequest(request));
  return response;
}
