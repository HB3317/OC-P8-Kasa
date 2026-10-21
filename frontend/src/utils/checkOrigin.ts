/**
 * Checks whether the request originates from the same origin.
 * Provides an additional safeguard against cross-site requests.
 */
export function checkOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) return false;

  return origin === new URL(request.url).origin;
}
