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
            content="Webcam Bridge for Nikon: bridge your Nikon USB webcam into Zoom, Teams, or OBS, with HTTP control for focus and exposure."
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
