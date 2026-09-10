import { defineConfig } from "@solidjs/start/config";
import { getPrerenderRoutes } from "./scripts/site-routes.mjs";

const base = process.env.VITE_BASE_PATH ?? "/nikon-camera-bridge/";

export default defineConfig({
  ssr: true,
  server: {
    preset: "static",
    baseURL: base === "/" ? "/" : base.replace(/\/$/, ""),
    prerender: {
      routes: getPrerenderRoutes(),
      crawlLinks: false,
    },
  },
  vite: {
    base,
  },
});
