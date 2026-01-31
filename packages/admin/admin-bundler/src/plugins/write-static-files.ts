import type { Plugin } from "vite"
import { writeStaticFiles as writeStaticFilesUtils } from "../utils/write-static-files"

interface WriteStaticFilesPluginOptions {
  plugins?: string[]
}

export const writeStaticFiles = (
  options: WriteStaticFilesPluginOptions
): Plugin => {
  return {
    name: "acmekit:write-static-files",
    buildStart: async (ctx) => {
      await writeStaticFilesUtils(options.plugins)
    },
  }
}
