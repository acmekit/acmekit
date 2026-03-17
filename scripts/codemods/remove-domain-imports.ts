/**
 * jscodeshift codemod: remove-domain-imports
 * Removes all import declarations from a specified @medusajs/DOMAIN package.
 * Usage: npx jscodeshift -t scripts/codemods/remove-domain-imports.ts \
 *   --extensions=ts,tsx --parser=tsx --domain=cart \
 *   packages/
 */
import type { Transform, API, FileInfo, Options } from 'jscodeshift'

const transform: Transform = (file: FileInfo, api: API, options: Options) => {
  const domain = options.domain as string
  if (!domain) {
    throw new Error('--domain option is required. E.g. --domain=cart')
  }

  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  // Remove: import ... from "@medusajs/DOMAIN" or "@medusajs/DOMAIN/..."
  root
    .find(j.ImportDeclaration, {
      source: {
        value: (v: string) =>
          typeof v === 'string' &&
          (v === `@medusajs/${domain}` || v.startsWith(`@medusajs/${domain}/`)),
      },
    })
    .forEach(() => { changed = true })
    .remove()

  return changed ? root.toSource({ quote: 'double' }) : null
}

export default transform
