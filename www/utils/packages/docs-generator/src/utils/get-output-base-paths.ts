import path from "path"
import getMonorepoRoot from "./get-monorepo-root.js"

/**
 * Retrieves the base path to the `oas-output` directory.
 */
export function getOasOutputBasePath() {
  return path.join(getMonorepoRoot(), "www", "utils", "generated", "oas-output")
}

/**
 * Retrieves the base path to the `dml-output` directory
 */
export function getDmlOutputBasePath() {
  return path.join(getMonorepoRoot(), "www", "utils", "generated", "dml-output")
}

/**
 * Retrieves the base path to the `events-output` directory.
 */
export function getEventsOutputBasePath() {
  return path.join(
    getMonorepoRoot(),
    "www",
    "utils",
    "generated",
    "events-output.json"
  )
}

/**
 * Retrieves the base path to the `route-examples-output` directory.
 */
export function getRouteExamplesOutputBasePath() {
  return path.join(
    getMonorepoRoot(),
    "www",
    "utils",
    "generated",
    "route-examples-output",
    "route-examples.json"
  )
}
