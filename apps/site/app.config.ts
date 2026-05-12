import { defineConfig } from "@solidjs/start/config";

const base = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  ssr: true,
  server: {
    preset: "static",
    baseURL: base === "/" ? "/" : base.replace(/\/$/, ""),
    prerender: {
      routes: ["/", "/about"],
      crawlLinks: false,
    },
  },
  vite: {
    base,
  },
});
