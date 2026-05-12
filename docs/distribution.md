# Distribution (WinGet, Homebrew, Linux, cross‑arch)

This repo ships **binaries from GitHub Releases** for **Windows (x64 + arm64)**, **Linux (x64 + arm64)**, and **macOS (x64 + arm64)**. The **HTTP API** (`packages/api`) and **core** libraries are plain Node/npm tarballs and run anywhere Node runs; the **Electron desktop** is what varies per OS and CPU.

## What each channel consumes

| Channel | Format | Architectures | Source |
|---------|--------|-----------------|--------|
| **Microsoft Store** | MSIX (from CI; upload in Partner Center) | x64, arm64 | [Store listing](https://apps.microsoft.com/detail/9n90q0c8f6zw) · package **`AMDphreak.WebcamBridgeforNikon`** |
| **WinGet** | **`.msi`**, **`.msix`**, portable **`.zip`** | x64, arm64 | GitHub Release assets + generated manifests in `winget-manifests/` |
| **Homebrew** | Cask **`.dmg`** | Intel + Apple Silicon | `release-assets/homebrew/webcam-bridge-for-nikon.rb` (generated on release) |
| **Debian / Ubuntu** | `.deb` | x64, arm64 | GitHub Release `.deb` assets |
| **AppImage** | `.AppImage` | x64, arm64 | GitHub Release (no root install required) |
| **Flatpak (bundle)** | `.flatpak` single-file | x64, arm64 | Built in **Release** / **CI** via electron-builder; Flathub submission still uses `distrib/flatpak/` |
| **Arch (AUR)** | `PKGBUILD` | x86_64, aarch64 | Template `distrib/aur/PKGBUILD.in` |
| **Snap** | `.snap` | amd64 / arm64 | Optional; add `snapcraft.yaml` if you want Snapcraft builds (not generated in CI yet). |

Fully automated publishing to **microsoft/winget-pkgs**, **Homebrew/homebrew-cask**, and **Flathub** requires **maintainer accounts**, **tokens**, and **human review** on those ecosystems. This repository automates **building**, **hashing**, and **attaching** artifacts plus **rendering** manifest snippets you can copy into upstream PRs.

## Microsoft Store

- **Store product:** [apps.microsoft.com/detail/9n90q0c8f6zw](https://apps.microsoft.com/detail/9n90q0c8f6zw) (ID **`9N90Q0C8F6ZW`**).
- **MSIX identity** in `apps/desktop/package.json` → `build.msix`: **`identityName`** `AMDphreak.WebcamBridgeforNikon`, **`publisher`** `CN=6AC37873-9F91-4911-9411-D11B8BA63A5C`, **`applicationId`** `WebcamBridgeforNikon`.
- **CI / Release** builds **`.msix`** per architecture alongside MSI and zip. **Signing:** Partner Center ingestion often uses your publisher certificate; for local or GitHub builds you may need a **`.pfx`** (and password) from Partner Center and wire it through electron-builder’s Windows signing options—if the MSIX step fails on the runner, add secrets and configure signing per [Microsoft’s MSIX signing guidance](https://learn.microsoft.com/en-us/windows/msix/package/create-certificate-package-signing).

## WinGet (Windows Package Manager)

1. Tag a release (for example `v0.3.0`). The **Release** workflow uploads Windows **`.msi`**, **`.msix`**, and portable **`.zip`** files and writes `release-assets/winget-manifests/*.yaml` next to them.
2. Download the three YAML files from the release (or copy them from a local run after `node scripts/render-winget.mjs`).
3. Open a PR against **[microsoft/winget-pkgs](https://github.com/microsoft/winget-pkgs)** under  
   `manifests/a/AMDphreak/WebcamBridgeforNikon/<version>/`  
   or use **`wingetcreate`** / **`Komac`** with the same metadata.
4. If validation fails on **`NestedInstallerFiles`** for the portable zip entries, unzip one Windows artifact locally and set `RelativeFilePath` to the real `.exe` path inside the archive. **MSI** and **MSIX** entries do not use nested installer metadata.

Optional PAT workflow: add a repository secret (for example `WINGET_PKGS_TOKEN`) and a `workflow_dispatch` job that forks `winget-pkgs`, copies the manifests, and opens a PR—only worth doing once the package id is accepted.

## Homebrew (macOS)

1. After a tagged release, use the generated **`release-assets/homebrew/webcam-bridge-for-nikon.rb`** (from CI) or run:

   ```bash
   VERSION=0.3.0 ASSETS_DIR=./path/to/assets node scripts/render-homebrew-cask.mjs
   ```

2. Open a PR to **[Homebrew/homebrew-cask](https://github.com/Homebrew/homebrew-cask)** *or* maintain a **tap** (for example `AMDphreak/homebrew-tap`) and commit the cask there for faster iteration.

3. The cask is **not notarized**; users may need to use **Open** from the right‑click menu the first launch. Replace with a signed/notarized `.dmg` later if you obtain an Apple Developer Program membership.

## Linux: Debian/Ubuntu (`.deb`), AppImage, and Flatpak bundle

Release assets include **`.deb`**, **`.AppImage`**, and **`.flatpak`** (single-file bundle from electron-builder) per architecture. Users can `dpkg -i` the deb, `chmod +x` and run the AppImage, or install the **`.flatpak`** with a recent Flatpak CLI (see [Flatpak single-file bundles](https://docs.flatpak.org/en/latest/single-file-bundles.html)).  
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
