import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { createInitialBridgeState, type BridgeState } from '@nikon-camera-bridge/core'

const json = (res: ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf8')
}

/** In-memory mirror of bridge state for health demos; later this delegates to the real core service. */
let mirrorState: BridgeState = createInitialBridgeState()

export function createBridgeApiServer(port: number) {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url ?? '/'
    try {
      if (req.method === 'GET' && url === '/health') {
        return json(res, 200, { ok: true, component: 'api', port })
      }
      if (req.method === 'GET' && url === '/v1/state') {
        return json(res, 200, { state: mirrorState })
      }
      if (req.method === 'POST' && url === '/v1/command') {
        return json(res, 501, {
          error: 'not_implemented',
          detail: 'PTP mapping will live here; body schema TBD.'
        })
      }
      if (req.method === 'POST' && url === '/v1/state/mirror') {
        const body = await readBody(req)
        try {
          const parsed = JSON.parse(body || '{}') as Partial<BridgeState>
          mirrorState = { ...mirrorState, ...parsed }
          return json(res, 200, { state: mirrorState })
        } catch {
          return json(res, 400, { error: 'invalid_json' })
        }
      }
      return json(res, 404, { error: 'not_found', path: url })
    } catch (err) {
      return json(res, 500, { error: 'internal', message: String(err) })
    }
  })

  return {
    server,
    listen: () =>
      new Promise<void>((resolve, reject) => {
        server.listen(port, () => resolve())
        server.on('error', reject)
      }),
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()))
      })
  }
}

export type { BridgeState }
