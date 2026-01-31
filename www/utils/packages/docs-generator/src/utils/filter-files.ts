import { minimatch } from "minimatch"

export default function (files: string[]): string[] {
  return files.filter((file) =>
    minimatch(
      file,
      "**/packages/@(acmekit|core/types|acmekit-js|acmekit-react)/src/**/*.@(ts|tsx|js|jsx)",
      {
        matchBase: true,
      }
    )
  )
}
