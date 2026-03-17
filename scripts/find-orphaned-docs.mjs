#!/usr/bin/env node
/**
 * Finds MDX files that reference deleted routes or non-existent paths.
 * Usage: node scripts/find-orphaned-docs.mjs
 */
import { glob } from 'glob'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'

const files = await glob('www/apps/**/*.mdx', { ignore: ['**/node_modules/**'] })

// Pattern: find [text](relative-path) links in MDX
const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g

let orphanCount = 0
for (const file of files) {
  const content = readFileSync(file, 'utf8')
  let m
  while ((m = LINK_RE.exec(content)) !== null) {
    const href = m[2]
    // Only check relative links (not http/https, not anchors)
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('/')) continue
    const resolved = resolve(dirname(file), href)
    if (!existsSync(resolved) && !existsSync(resolved + '.mdx') && !existsSync(resolved + '/page.mdx')) {
      console.log(`ORPHAN: ${file}\n  → ${href}`)
      orphanCount++
    }
  }
}

console.log(`\nTotal orphaned links: ${orphanCount}`)
