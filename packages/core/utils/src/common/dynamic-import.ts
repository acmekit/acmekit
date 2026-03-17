import { isFileDisabled, MEDUSA_SKIP_FILE } from "./define-file-config"
import { resolveExports } from "./resolve-exports"

/**
 * Utility that should be used instead of either await import() or require()
 * to avoid bundling issues. That way we have a single place
 * where we manage the strategy to dynamically import a module.
 *
 * This issue arise from migration to Node16 or NodeNext module resolution as well
 * as ts-node not being maintained anymore and throwing deprecation warnings.
 * all over the place.
 *
 * @param path
 */
export async function dynamicImport(path: string): Promise<any> {
  const module = require(path)

  const exported = resolveExports(module)

  if (isFileDisabled(path)) {
    exported[MEDUSA_SKIP_FILE] = true
  }

  return exported
}
