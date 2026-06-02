import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export type ApiErrorBody = {
  message: string;
  code?: string;
  details?: unknown;
};

export type ApiSuccessBody<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiFailureBody = {
  success: false;
  error: ApiErrorBody;
  meta?: Record<string, unknown>;
};

export function apiSuccess<T>(
  data: T,
  init?: { status?: number; meta?: Record<string, unknown> },
): NextResponse<ApiSuccessBody<T>> {
  const body: ApiSuccessBody<T> = { success: true, data };
  if (init?.meta) body.meta = init.meta;
  return NextResponse.json(body, { status: init?.status ?? 200 });
}

export function apiError(
  message: string,
  status: number,
  code?: string,
  extra?: Omit<ApiErrorBody, "message" | "code">,
): NextResponse<ApiFailureBody> {
  const error: ApiErrorBody = { message, ...(code ? { code } : {}), ...extra };
  return NextResponse.json({ success: false, error }, { status });
}

/** Zod / field validation — 422 with flattened field paths in `error.details`. */
export function apiValidationError(
  message: string,
  details: unknown,
): NextResponse<ApiFailureBody> {
  return apiError(message, 422, "VALIDATION_ERROR", { details });
}

export function apiZodError(error: ZodError, message = "Validation failed") {
  return apiValidationError(message, error.flatten());
}

/** List endpoint meta when DB pagination is not applied yet. */
export function listMeta<T>(
  items: readonly T[],
  extra?: { page?: number; limit?: number },
): Record<string, unknown> {
  return { total: items.length, ...extra };
}

/** Parse error message from envelope or legacy `{ error: string }` responses. */
export function getApiErrorMessage(body: unknown): string {
  if (!body || typeof body !== "object") return "Request failed";
  const record = body as Record<string, unknown>;
  if (typeof record.error === "string") return record.error;
  if (
    record.error &&
    typeof record.error === "object" &&
    "message" in record.error &&
    typeof (record.error as ApiErrorBody).message === "string"
  ) {
    return (record.error as ApiErrorBody).message;
  }
  return "Request failed";
}

/** Read `data` from envelope; pass through legacy bodies unchanged. */
export function getApiData<T>(body: unknown): T {
  if (body && typeof body === "object" && "success" in body && (body as ApiSuccessBody<T>).success === true) {
    return (body as ApiSuccessBody<T>).data;
  }
  return body as T;
}
