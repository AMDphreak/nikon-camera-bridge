export const SITE_ORIGIN = "https://desktop-tooling.github.io";
export const SITE_BASE = "/nikon-camera-bridge";

export function getPrerenderRoutes() {
  return ["/", "/about"];
}

export function getSitemapRoutes() {
  return getPrerenderRoutes();
}

export function absoluteUrl(route) {
  const base = SITE_BASE.replace(/\/$/, "");
  if (route === "/") return `${SITE_ORIGIN}${base}/`;
  return `${SITE_ORIGIN}${base}${route}`;
}
