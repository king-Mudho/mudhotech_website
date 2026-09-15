import { handleSubmission } from "@/lib/api/submission-handler";
import { quoteSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  return handleSubmission(request, quoteSchema, "/api/submissions/quote/", (data) => ({
    name: data.name,
    business: data.business || null,
    email: data.email,
    phone: data.phone || null,
    service_type: data.serviceType,
    description: data.description,
    preferred_contact_method: data.preferredContact || null,
  }));
}
