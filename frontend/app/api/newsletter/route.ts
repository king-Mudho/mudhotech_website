import { handleSubmission } from "@/lib/api/submission-handler";
import { newsletterSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  return handleSubmission(request, newsletterSchema, "/api/newsletter/", (data) => ({
    email: data.email,
  }));
}
