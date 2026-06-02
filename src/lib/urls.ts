/** Turn server path (/i/slug/...) into full URL for current browser host */
export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    try {
      const u = new URL(pathOrUrl);
      if (typeof window !== "undefined") {
        return `${window.location.origin}${u.pathname}${u.search}${u.hash}`;
      }
      return pathOrUrl;
    } catch {
      return pathOrUrl;
    }
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  if (typeof window === "undefined") {
    return `http://localhost:3000${path}`;
  }
  return `${window.location.origin}${path}`;
}
