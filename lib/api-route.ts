import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api-response";

export type RouteContext = { params: Promise<Record<string, string>> };

type HandlerNoContext = (
  request: NextRequest,
) => Promise<NextResponse> | NextResponse;
type HandlerWithContext = (
  request: NextRequest,
  context: RouteContext,
) => Promise<NextResponse> | NextResponse;

/** Catch unexpected errors and return the standard error envelope. */
export function withApiHandler(handler: HandlerNoContext): HandlerNoContext;
export function withApiHandler(handler: HandlerWithContext): HandlerWithContext;
export function withApiHandler(
  handler: HandlerNoContext | HandlerWithContext,
): HandlerNoContext | HandlerWithContext {
  if (handler.length >= 2) {
    return async (request: NextRequest, context: RouteContext) => {
      try {
        return await (handler as HandlerWithContext)(request, context);
      } catch (err) {
        console.error("[api]", err);
        return apiError("Internal server error", 500, "INTERNAL_ERROR");
      }
    };
  }

  return async (request: NextRequest) => {
    try {
      return await (handler as HandlerNoContext)(request);
    } catch (err) {
      console.error("[api]", err);
      return apiError("Internal server error", 500, "INTERNAL_ERROR");
    }
  };
}
