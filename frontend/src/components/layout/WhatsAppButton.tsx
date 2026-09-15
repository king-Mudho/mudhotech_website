import { MessageCircle } from "lucide-react";
import { whatsappUrl, WHATSAPP_GREETING } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl(WHATSAPP_GREETING)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 bg-whatsapp text-whatsapp-foreground rounded-full p-4 shadow-lg shadow-whatsapp/30 hover:scale-110 transition-transform duration-200"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
