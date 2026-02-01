import { infrastructureModulesSidebar } from "./sidebars/infrastructure-modules.mjs"
import { integrationsSidebar } from "./sidebars/integrations.mjs"
import { recipesSidebar } from "./sidebars/recipes.mjs"
import { referencesSidebar } from "./sidebars/references.mjs"
import { toolsSidebar } from "./sidebars/tools.mjs"
import { troubleshootingSidebar } from "./sidebars/troubleshooting.mjs"
import { howToTutorialsSidebar } from "./sidebars/how-to-tutorials.mjs"

/** @type {import("types").Sidebar.RawSidebar[]} */
export const sidebar = [
  {
    sidebar_id: "recipes",
    title: "Recipes",
    items: recipesSidebar,
  },
  {
    sidebar_id: "how-to-tutorials",
    title: "How-To & Tutorials",
    items: howToTutorialsSidebar,
  },
  {
    sidebar_id: "integrations",
    title: "Integrations",
    items: integrationsSidebar,
  },
  {
    sidebar_id: "tools",
    title: "Tools",
    items: toolsSidebar,
  },
  {
    sidebar_id: "references",
    title: "References",
    items: referencesSidebar,
  },
  {
    sidebar_id: "infrastructure-modules",
    title: "Infrastructure Modules",
    items: infrastructureModulesSidebar,
  },
  {
    sidebar_id: "troubleshooting",
    title: "Troubleshooting",
    items: troubleshootingSidebar,
  },
]
