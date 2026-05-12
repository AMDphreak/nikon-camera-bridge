import { mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distPack = join(root, 'dist-pack')
const packages = [
  '@nikon-uvc-ptp-bridge/core',
  '@nikon-uvc-ptp-bridge/api',
  '@nikon-uvc-ptp-bridge/video'
]

await mkdir(distPack, { recursive: true })

for (const name of packages) {
  const quotedDest = JSON.stringify(distPack)
  const quotedName = JSON.stringify(name)
  execSync(`pnpm --filter ${quotedName} pack --pack-destination ${quotedDest}`, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env
  })
}

console.log('Packed:', (await readdir(distPack)).join(', '))
