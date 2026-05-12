# Marketing site (`apps/site`)

Small **[SolidStart](https://start.solidjs.com/)** (**1.x** + **Vinxi**) site for the Nikon UVC–PTP Bridge. The production build uses Nitro’s **`static`** preset with **prerendered** routes `/` and `/about`.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm run dev` | Dev server (from this directory, or `pnpm run dev:site` from repo root). |
| `pnpm run build` | Static output under **`.output/public/`** (run with `VITE_BASE_PATH` set in CI for GitHub Pages). |

## GitHub Pages

The repo workflow [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) sets:

`VITE_BASE_PATH=/<repository-name>/`

so asset and router URLs match a **project site** at `https://<user>.github.io/<repo>/`. Enable **Settings → Pages → Build: GitHub Actions** once.

## Node

SolidStart **1.3.x** expects **Node 22+** (same as the site CI job). This package does not define a `typecheck` script; `pnpm typecheck` at the repo root only runs the library and desktop packages.
