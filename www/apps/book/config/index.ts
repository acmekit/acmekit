import { DocsConfig, Sidebar } from "types"
import { globalConfig } from "docs-ui"
import { generatedSidebars } from "../generated/sidebar.mjs"
import { basePathUrl } from "../utils/base-path-url"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "AcmeKit Documentation",
  description:
    "Explore and learn how to use AcmeKit. Learn how to get started, the fundamental concepts, how to customize AcmeKit, and more.",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebars: generatedSidebars as Sidebar.Sidebar[],
  project: {
    title: "Documentation",
    key: "book",
  },
  logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`,
  breadcrumbOptions: {
    startItems: [
      {
        title: "Documentation",
        link: "/",
      },
    ],
  },
  version: {
    ...globalConfig.version,
    bannerImage: {
      light: basePathUrl("/images/release.png"),
      dark: basePathUrl("/images/release-dark.png"),
    },
  },
}
