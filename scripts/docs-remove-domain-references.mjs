#!/usr/bin/env node
/**
 * Scans www/ MDX files for references to deleted commerce domains.
 * Usage: node scripts/docs-remove-domain-references.mjs [--fix]
 */
import { glob } from 'glob'
import { readFileSync, writeFileSync } from 'fs'

const COMMERCE_DOMAINS = [
  'cart', 'order', 'payment', 'product', 'pricing', 'promotion',
  'fulfillment', 'inventory', 'tax', 'region', 'sales-channel',
  'stock-location', 'currency', 'store',
]

const FIX = process.argv.includes('--fix')
const files = await glob('www/apps/**/*.mdx', { ignore: ['**/node_modules/**'] })

let totalHits = 0
for (const file of files) {
  const content = readFileSync(file, 'utf8')
  const hits = []
  for (const domain of COMMERCE_DOMAINS) {
    const re = new RegExp(`/commerce-modules/${domain}|@medusajs/${domain}`, 'g')
    let m
    while ((m = re.exec(content)) !== null) {
      hits.push({ domain, index: m.index, match: m[0] })
    }
  }
  if (hits.length > 0) {
    console.log(`${file}: ${hits.length} hit(s)`)
    hits.forEach(h => console.log(`  ${h.match}`))
    totalHits += hits.length
  }
}

console.log(`\nTotal: ${totalHits} commerce domain references found in www/`)
if (totalHits > 0 && !FIX) {
  console.log('Run with --fix to attempt automatic removal.')
}
