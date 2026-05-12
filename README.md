# Nikon UVC-PTP Bridge

Windows-first desktop shell that will consolidate **Nikon USB webcam (UVC)** access with **PTP-style camera control** in a single service, then **re-publish** video to other applications through a virtual camera (or equivalent) instead of letting every app fight the stock driver stack.

## Why v0.1.0 is mostly scaffolding

True “driver man-in-the-middle” interception—where arbitrary apps keep using the original device node while you splice into the kernel stack—is **not** something a signed user-mode Electron app can do safely. The practical plan is:

1. **Own the hardware** from one process using the supported USB stacks (WinUSB, still-image class, or vendor interfaces) so Webcam Utility and other consumers release the device.
2. **Demux** video and control inside the bridge.
3. **Expose a virtual camera** (Windows Media Foundation virtual camera, DirectShow source filter, or an OBS-style virtual device) that presents a stable device name to Teams, Zoom, OBS, and so on.

Version **0.1.0** ships the Electron UI, IPC contract, documentation, and CI. Native USB negotiation, frame pumps, and virtual camera registration are explicitly **out of scope** for this tag; they are tracked for the next milestones.

## Development

Requirements: Node 20+, pnpm 9+.

```powershell
pnpm install
pnpm dev
```

Typecheck and production bundle:

```powershell
pnpm typecheck
pnpm build
```

Windows zip artifact (unsigned, suitable for CI and local smoke tests):

```powershell
pnpm run build:win
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT
