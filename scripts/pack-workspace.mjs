import { mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distPack = join(root, 'dist-pack')
const packageDirs = ['packages/core', 'packages/api', 'packages/video']

await mkdir(distPack, { recursive: true })

const dest = JSON.stringify(distPack)

for (const rel of packageDirs) {
  execSync(`pnpm pack --pack-destination ${dest}`, {
    cwd: join(root, rel),
    stdio: 'inherit',
    shell: true,
    env: process.env
  })
}

console.log('Packed:', (await readdir(distPack)).join(', '))
