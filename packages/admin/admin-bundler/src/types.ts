import { AdminOptions } from "@acmekit/types"

export type BundlerOptions = Required<Pick<AdminOptions, "path">> &
  Pick<AdminOptions, "vite" | "backendUrl" | "frontendUrl" | "storefrontUrl"> & {
    outDir: string
    sources?: string[]
    plugins?: string[]
  }
