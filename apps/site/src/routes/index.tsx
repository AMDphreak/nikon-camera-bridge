import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <main class="hero">
      <Title>Nikon Camera Bridge</Title>
      <p class="eyebrow">Windows-first · x64 &amp; arm64 · open source</p>
      <h1 class="hero-title">One bridge for UVC video and camera control</h1>
      <p class="hero-lead">
        Consolidate <strong>Nikon USB webcam (UVC)</strong> access with{" "}
        <strong>PTP-style control</strong>, fan out through a{" "}
        <strong>virtual camera</strong> (Media Foundation on Windows), and drive automation from a{" "}
        <strong>small HTTP JSON API</strong>.
      </p>
      <div class="cta-row">
        <a
          class="btn primary"
          href="https://github.com/AMDphreak/nikon-camera-bridge/releases"
          target="_blank"
          rel="noreferrer"
        >
          Releases
        </a>
        <a
          class="btn ghost"
          href="https://github.com/AMDphreak/nikon-camera-bridge"
          target="_blank"
          rel="noreferrer"
        >
          Repository
        </a>
      </div>
      <section class="highlights" aria-labelledby="hl-heading">
        <h2 id="hl-heading" class="sr-only">
          Highlights
        </h2>
        <ul>
          <li>
            <strong>Monorepo layout</strong> — shared core, HTTP API package, video adapter, and Electron desktop shell.
          </li>
          <li>
            <strong>Cross-platform packaging</strong> — Windows, Linux, and macOS desktop builds; WinGet and Homebrew
            manifests are generated next to release assets (see Distribution).
          </li>
          <li>
            <strong>Honest scope</strong> — Media Foundation and USB exclusivity stay platform-specific; the TypeScript
            surface stays shared where it can.
          </li>
        </ul>
      </section>
    </main>
  );
}
