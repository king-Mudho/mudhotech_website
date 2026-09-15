import { withAdminAuth, djangoFetch } from "@/lib/api/admin-handler";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return withAdminAuth((token) =>
    djangoFetch("/api/admin/reply/", {
      method: "POST",
      token,
      body: JSON.stringify({
        to: body.to,
        subject: body.subject,
        message: body.message,
        submissionType: body.submissionType,
        submissionId: body.submissionId,
      }),
    }),
  );
}
