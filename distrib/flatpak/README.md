# Flatpak (template)

Flathub expects an AppStream metainfo file, desktop entry, and a manifest that either builds from source or, for prebuilt Electron apps, uses `extra-data` to download official binaries (see [Flathub — Electron](https://github.com/flathub/flathub/wiki/App-Submission)).

## Layout (proposed)

- `com.amdphreak.WebcamBridgeforNikon.yml` — main manifest (module can download release **`.deb`**, **`.AppImage`**, or **`.flatpak`** for `x86_64` / `aarch64`).
- `com.amdphreak.WebcamBridgeforNikon.metainfo.xml` — AppStream metadata (screenshots, releases, OARS).
- `com.amdphreak.WebcamBridgeforNikon.desktop` — `.desktop` launcher.

## Submission checklist

1. Confirm **application id** `com.amdphreak.WebcamBridgeforNikon` matches a domain you control (or adjust to a GitHub‑pages `io.github.*` id per Flathub rules).
2. Add **screenshots** and a **stable release** URL in metainfo.
3. Open a PR to **[flathub/flathub](https://github.com/flathub/flathub)** with the manifest in a new repository as per Flathub workflow.
4. Flathub CI builds on **x86_64** and **aarch64**; fix `extra-data` URLs and sha256 for each release.

Until a maintainer completes the Flathub PR, users on Linux should prefer the **`.deb`**, **`.AppImage`**, or **`.flatpak`** attached to GitHub Releases (see `docs/distribution.md`).
