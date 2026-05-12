import { createBridgeApiServer } from './index.js'

const port = Number(process.env.NIKON_BRIDGE_API_PORT ?? '37891')

const { server, listen } = createBridgeApiServer(port)

await listen()
console.log(`[nikon-bridge-api] listening on http://127.0.0.1:${port} (GET /health, GET /v1/state, POST /v1/command, POST /v1/state/mirror)`)

const shutdown = () => {
  server.close(() => process.exit(0))
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
