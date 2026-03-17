/**
 * jscodeshift codemod: rename-namespace
 * Renames all @medusajs/* imports to @acmekit/*.
 * Usage: npx jscodeshift -t scripts/codemods/rename-namespace.ts \
 *   --extensions=ts,tsx --parser=tsx --ignore-pattern="**/node_modules/**" \
 *   packages/ www/
 */
import type { Transform, API, FileInfo } from 'jscodeshift'

const transform: Transform = (file: FileInfo, api: API) => {
  const j = api.jscodeshift
  const root = j(file.source)
  let changed = false

  // Rename @medusajs/ → @acmekit/ in all import declarations
  root
    .find(j.ImportDeclaration)
    .filter(path => {
      const val = path.node.source.value as string
      return typeof val === 'string' && val.startsWith('@medusajs/')
    })
    .forEach(path => {
      const oldVal = path.node.source.value as string
      path.node.source.value = oldVal.replace('@medusajs/', '@acmekit/')
      changed = true
    })

  // Rename @medusajs/ → @acmekit/ in require() calls
  root
    .find(j.CallExpression, { callee: { name: 'require' } })
    .filter(path => {
      const args = path.node.arguments
      return (
        args.length > 0 &&
        args[0].type === 'StringLiteral' &&
        (args[0] as { value: string }).value.startsWith('@medusajs/')
      )
    })
    .forEach(path => {
      const arg = path.node.arguments[0] as { value: string }
      arg.value = arg.value.replace('@medusajs/', '@acmekit/')
      changed = true
    })

  return changed ? root.toSource({ quote: 'double' }) : null
}

export default transform
