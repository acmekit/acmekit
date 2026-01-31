import inject from "@acmekit/admin-vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import inspect from "vite-plugin-inspect"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const BASE = env.VITE_ACMEKIT_BASE || "/"
  const BACKEND_URL = env.VITE_ACMEKIT_BACKEND_URL || "http://localhost:9000"
  const STOREFRONT_URL =
    env.VITE_ACMEKIT_STOREFRONT_URL || "http://localhost:8000"

  /**
   * Add this to your .env file to specify the project to load admin extensions from.
   */
  const ACMEKIT_PROJECT = env.VITE_ACMEKIT_PROJECT || null
  const sources = ACMEKIT_PROJECT ? [ACMEKIT_PROJECT] : []

  return {
    plugins: [
      inspect(),
      react(),
      inject({
        sources,
      }),
    ],
    define: {
      __BASE__: JSON.stringify(BASE),
      __BACKEND_URL__: JSON.stringify(BACKEND_URL),
      __STOREFRONT_URL__: JSON.stringify(STOREFRONT_URL),
    },
    server: {
      open: true,
    },
  }
})
