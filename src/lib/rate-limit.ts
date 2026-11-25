/**
 * Minimal sliding-window rate limiter held in process memory.
 *
 * The site runs as a single container on EasyPanel, so one process sees every
 * request. If it is ever scaled out to several instances, swap this for a
 * shared store (Redis/Upstash) — each instance would otherwise count alone.
 */
const buckets = new Map<string, number[]>();
const MAX_KEYS = 10_000;

/** Returns true when the request is allowed, false when `key` is over `limit` in the last `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);

  // Bound memory: drop the oldest keys if a flood of distinct IPs arrives.
  if (buckets.size > MAX_KEYS) {
    const excess = buckets.size - MAX_KEYS;
    let i = 0;
    for (const k of buckets.keys()) {
      if (i++ >= excess) break;
      buckets.delete(k);
    }
  }
  return true;
}

/** Best-effort client IP behind Cloudflare / a reverse proxy. */
export function clientIp(h: Headers): string {
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}
