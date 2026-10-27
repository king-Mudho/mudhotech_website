/**
 * The visitor's IP as nginx saw it, for forwarding to Django's rate limits.
 *
 * Django only ever hears from this Next.js server, so without a forwarded
 * address every visitor shares one throttle bucket (backend settings,
 * NUM_PROXIES). nginx sets X-Real-IP from $remote_addr, overwriting anything
 * the client sent, so it is preferred. The rightmost X-Forwarded-For hop is
 * the fallback: it is the one appended by the nearest proxy (nginx in
 * production, Next's own server locally); hops to its left are
 * client-supplied and spoofable.
 */
const IP_PATTERN = /^[0-9a-fA-F:.]{2,45}$/;

export function visitorIpFrom(headers: Headers): string | null {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp && IP_PATTERN.test(realIp)) return realIp;

  const nearestHop = headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  if (nearestHop && IP_PATTERN.test(nearestHop)) return nearestHop;

  return null;
}
