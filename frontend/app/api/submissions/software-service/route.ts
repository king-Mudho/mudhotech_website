import { handleSubmission } from "@/lib/api/submission-handler";
import { softwareServiceRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  return handleSubmission(request, softwareServiceRequestSchema, "/api/submissions/software-service/", (data) => ({
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    service_category: data.serviceCategory,
    device: data.device || null,
    handover: data.handover || null,
    details: data.details,
  }));
}
