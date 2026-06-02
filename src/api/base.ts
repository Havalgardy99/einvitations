/** In dev use Vite proxy (/api, /uploads). In prod same origin as Express. */
export function getApiBase(): string {
  return "";
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBase()}${p}`;
}

export function mediaUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/uploads")) return apiUrl(src);
  return src;
}
