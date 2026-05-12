/**
 * Writes a Homebrew Cask Ruby file next to macOS DMGs (for a tap or homebrew-cask PR).
 * Usage: VERSION=0.3.0 ASSETS_DIR=release-assets node scripts/render-homebrew-cask.mjs
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const version = (process.env.VERSION ?? '').replace(/^v/, '')
const root = process.env.ASSETS_DIR ?? 'release-assets'
const outFile = join(root, 'homebrew', 'webcam-bridge-for-nikon.rb')

if (!version) {
  console.error('Set VERSION')
  process.exit(1)
}

const owner = 'AMDphreak'
const repo = 'nikon-camera-bridge'
const tag = `v${version}`
const base = `https://github.com/${owner}/${repo}/releases/download/${tag}`

async function sha256(path) {
  const buf = await readFile(path)
  return createHash('sha256').update(buf).digest('hex')
}

const intelName = `Webcam.Bridge.for.Nikon-${version}-mac-x64.dmg`
const armName = `Webcam.Bridge.for.Nikon-${version}-mac-arm64.dmg`

let intelSha
let armSha
try {
  intelSha = await sha256(join(root, intelName))
} catch {
  console.error('Missing', intelName, 'in', root)
  process.exit(1)
}
try {
  armSha = await sha256(join(root, armName))
} catch {
  console.error('Missing', armName, 'in', root)
  process.exit(1)
}

const fixed = `cask "webcam-bridge-for-nikon" do
  version "${version}"
  sha256 arm:   "${armSha}",
         intel: "${intelSha}"

  on_arm do
    url "${base}/${armName}",
        verified: "github.com/${owner}/${repo}/"
  end

  on_intel do
    url "${base}/${intelName}",
        verified: "github.com/${owner}/${repo}/"
  end

  name "Webcam Bridge for Nikon"
  desc "Desktop shell for the Nikon USB bridge (virtual camera + control API roadmap)"
  homepage "https://github.com/${owner}/${repo}"

  depends_on macos: ">= :catalina"

  app "Webcam Bridge for Nikon.app"

  caveats <<~EOS
    This build is not Apple-notarized. Control-click the app and choose Open on first launch if Gatekeeper blocks it.
  EOS
end
`

await mkdir(join(root, 'homebrew'), { recursive: true })
await writeFile(outFile, fixed)
console.log('Homebrew cask written to', outFile)
