import { Title } from "@solidjs/meta";

export default function About() {
  return (
    <main class="page prose">
      <Title>Download &amp; platforms — Nikon UVC–PTP Bridge</Title>
      <h1>Download &amp; platforms</h1>
      <p>
        Desktop installers and portable archives are published on{" "}
        <a href="https://github.com/AMDphreak/nikon-uvc-ptp-bridge/releases" target="_blank" rel="noreferrer">
          GitHub Releases
        </a>{" "}
        for <strong>Windows</strong> (x64 and arm64), <strong>Linux</strong> (tar.gz and deb, x64 and arm64), and{" "}
        <strong>macOS</strong> (zip, x64 and arm64).
      </p>
      <p>
        WinGet, Homebrew cask stubs, Flatpak/AUR notes, and maintainer flows are documented in{" "}
        <a
          href="https://github.com/AMDphreak/nikon-uvc-ptp-bridge/blob/main/docs/distribution.md"
          target="_blank"
          rel="noreferrer"
        >
          <code>docs/distribution.md</code>
        </a>
        .
      </p>
    </main>
  );
}
