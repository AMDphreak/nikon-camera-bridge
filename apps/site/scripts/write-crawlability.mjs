import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { absoluteUrl, getSitemapRoutes, SITE_ORIGIN } from "./site-routes.mjs";

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, ".output", "public");
const locs = [...new Set(getSitemapRoutes().map((r) => absoluteUrl(r)))];
const body = locs.map((loc) => `  <url><loc>${escapeXml(loc)}</loc></url>`).join("\n");
const sitemapLoc = `${SITE_ORIGIN}/nikon-camera-bridge/sitemap.xml`;

writeFileSync(
  join(pub, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
);
writeFileSync(
  join(pub, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${sitemapLoc}\n`,
);
