// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACMEKIT_ADMIN_BACKEND_URL: string
  readonly VITE_ACMEKIT_FRONTEND_URL: string
  /** @deprecated Use VITE_ACMEKIT_FRONTEND_URL */
  readonly VITE_ACMEKIT_STOREFRONT_URL: string
  readonly VITE_ACMEKIT_V2: "true" | "false"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly hot: {
    accept: () => void
  }
}

declare const __BACKEND_URL__: string | undefined
declare const __FRONTEND_URL__: string | undefined
declare const __BASE__: string
declare const __AUTH_TYPE__: "session" | "jwt" | undefined
declare const __JWT_TOKEN_STORAGE_KEY__: string | undefined
