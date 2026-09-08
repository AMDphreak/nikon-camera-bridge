# SVG audit

Audit date: 2026-09-08

## Migrated diagrams

- Root architecture diagrams: logical architecture, product consumers, monorepo packages, and Media Foundation placement.
- Package relationship diagrams: core, API, video, and desktop.
- Each diagram now has editable Mermaid source, a version 1 theme manifest, standalone-adaptive and host SVGs, a fixed light SVG, and the renderer intermediate used by freshness checks.

## Retained artwork

- `apps/site/public/favicon.svg` — retain as-is. This is a product favicon/brand icon, not a relationship or process diagram.

## Skipped candidates

- None. Every authored inline Mermaid block in the repository described a relationship, architecture, or process and was migrated.
