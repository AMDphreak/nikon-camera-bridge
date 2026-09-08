import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { basename, dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  prepareThemedMermaidSvg,
  prepareThemedMermaidSvgDualOutput,
} from "@dev-centr/mermaid-svg-css-vars"

const check = process.argv.includes("--check")
const root = resolve(import.meta.dirname, "..")
const diagramDirectory = join(root, "docs", "diagrams")
const siteDiagramDirectory = join(root, "apps", "site", "public", "diagrams")
const antoraImageDirectory = join(root, "docs", "modules", "ROOT", "images")
const configPath = join(root, "scripts", "mermaid-config.json")
const puppeteerConfigPath = join(root, "scripts", "puppeteer-github-actions.json")
const mermaidModulePath = fileURLToPath(import.meta.resolve("@mermaid-js/mermaid-cli"))
const mermaidCli = join(dirname(mermaidModulePath), "cli.js")
const sources = readdirSync(diagramDirectory).filter((name) => name.endsWith(".mmd")).sort()
const temporaryDirectory = mkdtempSync(join(tmpdir(), "nikon-camera-bridge-diagrams-"))
mkdirSync(siteDiagramDirectory, { recursive: true })
mkdirSync(antoraImageDirectory, { recursive: true })
let stale = false

const tokens = [
  "color.canvas",
  "color.surface.primary",
  "color.surface.secondary",
  "color.text.primary",
  "color.border.primary",
  "color.edge",
]

function updateOrCheck(path, content) {
  if (check) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== content) {
      console.error(`Stale generated diagram: ${path.slice(root.length + 1)}`)
      stale = true
    }
    return
  }
  writeFileSync(path, content, "utf8")
}

function manifestFor(name) {
  const rootSelector = `#${name}`
  return {
    schemaVersion: 1,
    namespace: `nikon-${name}`,
    source: {
      kind: "mermaid",
      uri: `${name}.mmd`,
      generator: "@mermaid-js/mermaid-cli@11.17.0",
    },
    tokens: tokens.map((id) => ({ id })),
    defaultPreset: "light",
    presets: {
      light: {
        "color.canvas": "#ffffff",
        "color.surface.primary": "#e0f2fe",
        "color.surface.secondary": "#f8fafc",
        "color.text.primary": "#0f172a",
        "color.border.primary": "#0369a1",
        "color.edge": "#475569",
      },
    },
    paletteOverrides: {
      dark: {
        "color.canvas": "#0f172a",
        "color.surface.primary": "#0c4a6e",
        "color.surface.secondary": "#1e293b",
        "color.text.primary": "#f8fafc",
        "color.border.primary": "#38bdf8",
        "color.edge": "#cbd5e1",
      },
    },
    bindings: [
      { kind: "inline-style", selector: "svg", property: "background-color", token: "color.canvas" },
      { kind: "stylesheet", selector: rootSelector, property: "fill", token: "color.text.primary" },
      { kind: "stylesheet", selector: `${rootSelector} .label text`, property: "fill", token: "color.text.primary" },
      ...["rect", "circle", "ellipse", "polygon", "path"].flatMap((shape) => [
        { kind: "stylesheet", selector: `${rootSelector} .node ${shape}`, property: "fill", token: "color.surface.primary" },
        { kind: "stylesheet", selector: `${rootSelector} .node ${shape}`, property: "stroke", token: "color.border.primary" },
      ]),
      { kind: "stylesheet", selector: `${rootSelector} .cluster rect`, property: "fill", token: "color.surface.secondary" },
      { kind: "stylesheet", selector: `${rootSelector} .cluster rect`, property: "stroke", token: "color.border.primary" },
      { kind: "stylesheet", selector: `${rootSelector} .cluster-label text`, property: "fill", token: "color.text.primary" },
      { kind: "stylesheet", selector: `${rootSelector} .marker`, property: "fill", token: "color.edge" },
      { kind: "stylesheet", selector: `${rootSelector} .marker`, property: "stroke", token: "color.edge" },
      { kind: "stylesheet", selector: `${rootSelector} .edgePaths .path`, property: "stroke", token: "color.edge" },
      { kind: "stylesheet", selector: `${rootSelector} .flowchart-link`, property: "stroke", token: "color.edge" },
    ],
    fallback: { unresolvedToken: "error", missingTarget: "error" },
  }
}

function errorsFor(result) {
  return result.diagnostics.filter((diagnostic) => diagnostic.severity === "error")
}

try {
  for (const source of sources) {
    const name = basename(source, ".mmd")
    const stem = join(diagramDirectory, name)
    const temporaryRawPath = join(temporaryDirectory, `${name}.raw.svg`)
    const render = spawnSync(
      process.execPath,
      [
        mermaidCli,
        "--quiet",
        "--input",
        `${stem}.mmd`,
        "--output",
        temporaryRawPath,
        "--configFile",
        configPath,
        ...(process.platform === "linux" && process.env.GITHUB_ACTIONS === "true"
          ? ["--puppeteerConfigFile", puppeteerConfigPath]
          : []),
        "--backgroundColor",
        "transparent",
        "--svgId",
        name,
      ],
      { cwd: root, encoding: "utf8" },
    )
    if (render.error || render.status !== 0) {
      throw render.error ?? new Error(render.stderr || render.stdout || `Mermaid failed for ${name}`)
    }

    const rawSvg = readFileSync(temporaryRawPath, "utf8")
      .replace('role="graphics-document document"', 'role="img"')
      .replace(/\saria-roledescription="[^"]*"/, "")
    if (/<foreignObject\b/i.test(rawSvg)) throw new Error(`${name}: htmlLabels must remain disabled`)

    const manifest = manifestFor(name)
    const dual = prepareThemedMermaidSvgDualOutput(rawSvg, manifest)
    const fixed = prepareThemedMermaidSvg(rawSvg, manifest, { mode: "fixed", preset: "light" })
    const errors = [...errorsFor(dual), ...errorsFor(fixed)]
    if (errors.length || !dual.standaloneSvg || !dual.hostSvg || !fixed.svg) {
      throw new Error(`${name} transform failed:\n${errors.map((error) => `- ${error.message}`).join("\n")}`)
    }

    updateOrCheck(`${stem}.theme.json`, `${JSON.stringify(manifest, null, 2)}\n`)
    updateOrCheck(`${stem}.raw.svg`, rawSvg)
    updateOrCheck(`${stem}.svg`, dual.standaloneSvg)
    updateOrCheck(`${stem}.host.svg`, dual.hostSvg)
    updateOrCheck(`${stem}.fixed.svg`, fixed.svg)
    if (name === "logical-architecture") {
      updateOrCheck(join(siteDiagramDirectory, `${name}.svg`), dual.standaloneSvg)
      updateOrCheck(join(siteDiagramDirectory, `${name}.host.svg`), dual.hostSvg)
      updateOrCheck(join(antoraImageDirectory, `${name}.svg`), dual.standaloneSvg)
    }
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}

if (stale) process.exitCode = 1
else console.log(check ? "Diagram artifacts are current." : "Generated diagram artifacts.")
