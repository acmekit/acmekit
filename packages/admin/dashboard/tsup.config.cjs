import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/app.tsx"],
  format: ["cjs", "esm"],
  external: [
    "virtual:acmekit/forms",
    "virtual:acmekit/displays",
    "virtual:acmekit/routes",
    "virtual:acmekit/links",
    "virtual:acmekit/menu-items",
    "virtual:acmekit/widgets",
    "virtual:acmekit/i18n",
  ],
  tsconfig: "tsconfig.build.json",
  clean: true,
})
