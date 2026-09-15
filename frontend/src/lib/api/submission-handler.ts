import "server-only";
import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { djangoFetch, ApiError } from "@/lib/api/server";
import { HONEYPOT_FIELD_NAME, isHoneypotTripped } from "@/lib/honeypot";

/**
 * Shared pipeline for every public submission endpoint: honeypot check →
 * zod re-validation (same schema the client form used) → forward to Django,
 * which validates and throttles again. Returns the consistent error shape
 * from docs/08-api-design.md §6.
 */
export async function handleSubmission<T>(
  request: Request,
  schema: ZodSchema<T>,
  djangoPath: string,
  toPayload: (data: T) => Record<string, unknown>,
): Promise<NextResponse> {
  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { success: false, error: { message: "Invalid request body." } },
      { status: 400 },
    );
  }

  // Silently accept-and-drop bot submissions so they don't learn they were caught.
  if (isHoneypotTripped(body[HONEYPOT_FIELD_NAME])) {
    return NextResponse.json({ success: true });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
    }
    return NextResponse.json(
      { success: false, error: { message: "Please check the highlighted fields.", fields } },
      { status: 400 },
    );
  }

  try {
    await djangoFetch(djangoPath, {
      method: "POST",
      body: JSON.stringify(toPayload(parsed.data)),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return NextResponse.json(
        { success: false, error: { message: "Too many submissions. Please try again later." } },
        { status: 429 },
      );
    }
    // Never leak backend internals to the client (docs/08-api-design.md §3).
    console.error(`Submission failed for ${djangoPath}:`, error);
    return NextResponse.json(
      { success: false, error: { message: "Something went wrong. Please try again." } },
      { status: 500 },
    );
  }
}
