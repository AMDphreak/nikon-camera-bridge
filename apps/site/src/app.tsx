import { MetaProvider, Title } from "@solidjs/meta";
import { A, Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

function routerBase(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (base === "/") return undefined;
  return base.replace(/\/$/, "");
}

export default function App() {
  return (
    <Router
      base={routerBase()}
      root={props => (
        <MetaProvider>
          <Title>Nikon UVC–PTP Bridge</Title>
          <header class="site-header">
            <nav class="site-nav" aria-label="Primary">
              <A href="/" class="brand" end>
                Nikon UVC–PTP Bridge
              </A>
              <span class="nav-links">
                <A href="/about">Download &amp; platforms</A>
                <a
                  href="https://github.com/AMDphreak/nikon-uvc-ptp-bridge"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  href="https://github.com/AMDphreak/nikon-uvc-ptp-bridge/blob/main/docs/distribution.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  Distribution
                </a>
              </span>
            </nav>
          </header>
          <Suspense>{props.children}</Suspense>
          <footer class="site-footer">
            <p>
              Open source —{" "}
              <a
                href="https://github.com/AMDphreak/nikon-uvc-ptp-bridge/blob/main/LICENSE"
                target="_blank"
                rel="noreferrer"
              >
                MIT
              </a>
            </p>
          </footer>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
