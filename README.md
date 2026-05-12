# Nikon UVC-PTP Bridge (monorepo)

Windows-first **bridge** that will consolidate **Nikon USB webcam (UVC)** access with **PTP-style control** in one logical service, then **fan out video** through a **virtual camera** (Media Foundation) while exposing a **separate HTTP control API** for focus, exposure, and related commands.

This repository is a **pnpm workspace**: shared **core** types, a headless **HTTP API** package, a **video adapter** package (MF virtual camera, planned), and an **Electron desktop** shell. Each workspace has its own `README` with a focused diagram; this file ties the story together.

## Repository layout

| Path | Role |
|------|------|
| [packages/core](./packages/core/README.md) | Types and small state helpers (no Electron, no MF). |
| [packages/api](./packages/api/README.md) | HTTP JSON control surface (`/health`, stub `/v1/command`, …). |
| [packages/video](./packages/video/README.md) | MF virtual camera registration and frame pump (planned). |
| [apps/desktop](./apps/desktop/README.md) | Electron UI and IPC stubs for local control. |

## Architecture — logical layers (inside the eventual service)

One **core** owns USB and coordinates **two outward adapters**: video into MF, control into your HTTP API. Media Foundation is the **Microsoft library** you use to **implement** the virtual camera; it is not a replacement for your own control API.

```mermaid
flowchart TB
  subgraph apps["Other peoples apps"]
    Zoom[Zoom / Teams / OBS]
    Companion[Scripts / companion tools]
  end

  subgraph bridge["Your bridge one logical core"]
    USB[USB / PTP / UVC reader owns device]
    CTRL[Control engine maps API to camera commands]
    VID[Video pipeline decode scale timestamp]
    MFVC[MF virtual camera sink registers device]
    API[Your control API HTTP JSON]
  end

  Zoom -->|opens webcam| MFVC
  Companion -->|focus exposure etc| API
  API --> CTRL
  CTRL --> USB
  USB --> VID
  VID --> MFVC
```

## Who consumes what?

```mermaid
flowchart LR
  subgraph consumers["Consumers of your product"]
    A1[App A webcam]
    A2[App B webcam]
    C1[Control client 1]
    C2[Control client 2]
  end

  subgraph product["Your shipped software"]
    SVC[Bridge service / core]
    VCam[Virtual camera device node]
    API2[Control API endpoint]
  end

  A1 --> VCam
  A2 --> VCam
  C1 --> API2
  C2 --> API2
  VCam --> SVC
  API2 --> SVC
```

## Monorepo packages (build-time view)

```mermaid
flowchart TB
  subgraph repo["nikon-uvc-ptp-bridge"]
    pkg_core["packages/core"]
    pkg_video["packages/video"]
    pkg_api["packages/api"]
    app_gui["apps/desktop"]
  end
  pkg_video --> pkg_core
  pkg_api --> pkg_core
  app_gui --> pkg_core
  app_gui --> pkg_video
```

## Media Foundation (MF) placement

MF is a **Windows user-mode API** used to register and feed a **virtual camera**. Consuming apps talk to Windows; your process registers the device and pushes frames. Your **control API** does not need to go through MF.

```mermaid
flowchart TB
  subgraph windows["Windows"]
    MF[Media Foundation]
    Zoom2[Zoom]
  end

  subgraph yourproc["Your process"]
    Core[Core]
    MFSink[MF virtual camera adapter packages/video]
  end

  Core --> MFSink
  MFSink --> MF
  Zoom2 --> MF
```

## Development

Requirements: **Node 20+**, **pnpm 9+**.

```powershell
pnpm install
pnpm dev
```

`prepare` runs `pnpm run build:packages` after `pnpm install` so every library has a `dist/` output before the desktop typecheck or build. The desktop package sets `build.electronVersion` so **electron-builder** can resolve Electron under pnpm’s hoisted layout.

**HTTP API** (stub server):

```powershell
pnpm run dev:api
```

**Typecheck entire workspace:**

```powershell
pnpm typecheck
```

**Production build** (all packages + Electron bundle):

```powershell
pnpm build
```

**Windows desktop** (x64 + arm64 zip, unsigned):

```powershell
pnpm run build:win
```

**Linux desktop** (x64 + arm64 `.tar.gz` + `.deb`):

```powershell
pnpm run build:linux
```

**macOS desktop** (x64 + arm64 zip, unsigned):

```powershell
pnpm run build:mac
```

**Pack npm tarballs** for the three libraries (written to `dist-pack/`). Locally:

```powershell
pnpm run pack:packages
```

On **GitHub Actions**, library `.tgz` files are produced on the **Windows** desktop matrix leg (`pnpm run pack:packages`) so packing matches local developer machines; the Ubuntu job still compiles all packages for Linux CI coverage.

Electron writes each OS/arch combination under `apps/desktop/release/<staging-folder>/` so **x64** and **arm64** builds never share the same `win-unpacked` tree (avoids file locks on Windows).

## CI and releases

- **CI** (`.github/workflows/ci.yml`): Ubuntu builds `packages/*`. A **desktop matrix** on **Windows**, **Ubuntu**, and **macOS** typechecks the workspace, runs `pnpm build`, then packages **x64 + arm64** artifacts per OS (Windows zip, Linux tar.gz + deb, macOS zip). The Windows leg also runs **`pnpm run pack:packages`** and uploads **`bridge-windows`** (zips + library `.tgz`). Linux and macOS legs upload **`bridge-linux`** and **`bridge-macos`**.
- **Release** (`.github/workflows/release.yml`): On `v*` tags, merges all `bridge-*` artifacts, runs **`scripts/render-winget.mjs`** and **`scripts/render-homebrew-cask.mjs`**, and publishes everything under **`release-assets/**`** (binaries, WinGet YAML, Homebrew cask Ruby) to the GitHub Release.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
