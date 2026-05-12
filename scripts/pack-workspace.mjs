import { mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distPack = join(root, 'dist-pack')
const packages = [
  '@nikon-uvc-ptp-bridge/core',
  '@nikon-uvc-ptp-bridge/api',
  '@nikon-uvc-ptp-bridge/video'
]

await mkdir(distPack, { recursive: true })

for (const name of packages) {
  const p = spawn('pnpm', ['--filter', name, 'pack', '--pack-destination', distPack], {
    cwd: root,
    stdio: 'inherit',
    shell: true
  })
  await new Promise((resolve, reject) => {
    p.on('close', (code) =>
      code === 0 ? resolve(null) : reject(new Error(`pack ${name} exit ${code}`))
    )
  })
}

console.log('Packed:', (await readdir(distPack)).join(', '))
