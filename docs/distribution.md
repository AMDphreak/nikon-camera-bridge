# Distribution (WinGet, Homebrew, Linux, cross‑arch)

This repo ships **binaries from GitHub Releases** for **Windows (x64 + arm64)**, **Linux (x64 + arm64)**, and **macOS (x64 + arm64)**. The **HTTP API** (`packages/api`) and **core** libraries are plain Node/npm tarballs and run anywhere Node runs; the **Electron desktop** is what varies per OS and CPU.

## What each channel consumes

| Channel | Format | Architectures | Source |
|---------|--------|-----------------|--------|
| **WinGet** | Portable `.zip` | x64, arm64 | GitHub Release asset + generated manifests in `winget-manifests/` |
| **Homebrew** | Cask `.zip` (macOS `.app` inside) | Intel + Apple Silicon | `release-assets/homebrew/nikon-camera-bridge.rb` (generated on release) |
| **Debian / Ubuntu** | `.deb` | x64, arm64 | GitHub Release `.deb` assets |
| **Generic Linux** | `.tar.gz` | x64, arm64 | GitHub Release tarball |
| **Flathub / Flatpak** | Flatpak bundle | x86_64, aarch64 | See `distrib/flatpak/` (template + submission notes) |
| **Arch (AUR)** | `PKGBUILD` | x86_64, aarch64 | Template `distrib/aur/PKGBUILD.in` |
| **Snap** | `.snap` | amd64 / arm64 | Optional; add `snapcraft.yaml` if you want Snapcraft builds (not generated in CI yet). |

Fully automated publishing to **microsoft/winget-pkgs**, **Homebrew/homebrew-cask**, and **Flathub** requires **maintainer accounts**, **tokens**, and **human review** on those ecosystems. This repository automates **building**, **hashing**, and **attaching** artifacts plus **rendering** manifest snippets you can copy into upstream PRs.

## WinGet (Windows Package Manager)

1. Tag a release (for example `v0.3.0`). The **Release** workflow uploads Windows zips and writes `release-assets/winget-manifests/*.yaml` next to them.
2. Download the three YAML files from the release (or copy them from a local run after `node scripts/render-winget.mjs`).
3. Open a PR against **[microsoft/winget-pkgs](https://github.com/microsoft/winget-pkgs)** under  
   `manifests/a/AMDphreak/NikonCameraBridge/<version>/`  
   or use **`wingetcreate`** / **`Komac`** with the same metadata.
4. If validation fails on **`NestedInstallerFiles`**, unzip one Windows artifact locally and set `RelativeFilePath` to the real `.exe` path inside the archive.

Optional PAT workflow: add a repository secret (for example `WINGET_PKGS_TOKEN`) and a `workflow_dispatch` job that forks `winget-pkgs`, copies the manifests, and opens a PR—only worth doing once the package id is accepted.

## Homebrew (macOS)

1. After a tagged release, use the generated **`release-assets/homebrew/nikon-camera-bridge.rb`** (from CI) or run:

   ```bash
   VERSION=0.3.0 ASSETS_DIR=./path/to/assets node scripts/render-homebrew-cask.mjs
   ```

2. Open a PR to **[Homebrew/homebrew-cask](https://github.com/Homebrew/homebrew-cask)** *or* maintain a **tap** (for example `AMDphreak/homebrew-tap`) and commit the cask there for faster iteration.

3. The cask is **not notarized**; users may need to use **Open** from the right‑click menu the first launch. Replace with a signed/notarized `.dmg` later if you obtain an Apple Developer Program membership.

## Linux: Debian/Ubuntu (`.deb`) and tarballs

Release assets include **`.deb`** and **`.tar.gz`** per architecture. Users can `dpkg -i` the deb or unpack the tarball.  
For **official** inclusion in Debian/Ubuntu archives you would need an **ITP / RFS** process or a **PPA** on Launchpad—outside the scope of this repo’s automation, but the `.deb` is the usual starting point.

## Flatpak (Flathub and other remotes)

See **`distrib/flatpak/README.md`**: template manifest, `extra-data` download from GitHub Releases, and the Flathub submission checklist (AppStream `metainfo.xml`, builds for `x86_64` and `aarch64` on Flathub builders).

## Arch Linux (AUR)

Use **`distrib/aur/PKGBUILD.in`**: fill version and checksums from the release page, then publish to the AUR (or use a helper such as `aurpublish`). The AUR is community‑maintained; keeping a `PKGBUILD` in this repo is a convenience for whoever maintains the package.

## Local manifest rendering

From the repo root, with release binaries already in `./release-assets`:

```powershell
$env:VERSION = "0.3.0"
$env:ASSETS_DIR = "release-assets"
node scripts/render-winget.mjs
node scripts/render-homebrew-cask.mjs
```

## Cross‑platform strategy

- **One codebase** (TypeScript) for core, API, and desktop UI.
- **Native stacks** (Media Foundation virtual camera, USB kernel drivers) will be **platform‑specific implementations** behind the `packages/video` and future `core` native boundaries, with the same TypeScript API surface where possible.
