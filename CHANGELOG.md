# Changelog

## [0.2.0] - 2026-05-12

### Added

- pnpm workspace with `@nikon-uvc-ptp-bridge/core`, `@nikon-uvc-ptp-bridge/api`, `@nikon-uvc-ptp-bridge/video`, and `@nikon-uvc-ptp-bridge/desktop`.
- HTTP stub server in `packages/api` (`GET /health`, `GET /v1/state`, `POST /v1/command`, `POST /v1/state/mirror`).
- Component README files with focused Mermaid diagrams; root README documents the full system and layout tables.
- CI: Ubuntu builds `packages/*`; Windows builds the desktop zip and packs all library `.tgz` files in one job (packing on Linux runners was unreliable with pnpm `pack`).
- Release workflow on `v*` tags attaches all `.tgz` files plus the Windows zip.
- `scripts/pack-workspace.mjs` helper to write all three workspace `.tgz` files into `dist-pack/`.
- pnpm `confirmModulesPurge: false` and `public-hoist-pattern` for Electron so local installs and **electron-builder** behave under the workspace layout.
- Desktop `build.electronVersion` pinned for electron-builder when Electron is hoisted by pnpm.

### Changed

- Electron app moved to `apps/desktop`; root `package.json` is now a private workspace orchestrator.
- `prepare` runs `pnpm run build:packages` after install so workspace `dist/` exists for the desktop build.

[0.2.0]: https://github.com/AMDphreak/nikon-uvc-ptp-bridge/releases/tag/v0.2.0

## [0.1.0] - 2026-05-11

### Added

- Electron + electron-vite + TypeScript desktop shell with bridge status UI.
- IPC surface for future exclusive acquisition and virtual camera toggles (stubbed).
- GitHub Actions workflow for install, typecheck, and Windows build artifacts.
- Release workflow that attaches the Windows zip when a version tag is pushed.
- Documentation describing the intended layering (physical USB, demux, virtual sink, control API).

[0.1.0]: https://github.com/AMDphreak/nikon-uvc-ptp-bridge/releases/tag/v0.1.0
