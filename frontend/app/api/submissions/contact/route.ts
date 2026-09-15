import { handleSubmission } from "@/lib/api/submission-handler";
import { contactSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  return handleSubmission(request, contactSchema, "/api/submissions/contact/", (data) => ({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject,
    message: data.message,
  }));
}
