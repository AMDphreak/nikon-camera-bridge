// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

const faviconHref = `${import.meta.env.BASE_URL}favicon.svg`;

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Bridge Nikon USB webcam (UVC) with PTP-style control, virtual camera output, and a JSON control API."
          />
          <link rel="icon" type="image/svg+xml" href={faviconHref} />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
