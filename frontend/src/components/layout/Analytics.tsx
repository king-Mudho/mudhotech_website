import { cookies } from "next/headers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { COOKIE_CONSENT_NAME } from "@/lib/cookie-consent";

/**
 * GA4 is rendered server-side only when the consent cookie says "accepted".
 * Declining means the script is never sent to the browser at all — the
 * enforcement docs/13-deployment-launch.md §3 requires, not just a recorded
 * preference.
 */
export async function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return null;

  const consent = (await cookies()).get(COOKIE_CONSENT_NAME)?.value;
  if (consent !== "accepted") return null;

  return <GoogleAnalytics gaId={gaId} />;
}
