import { NavigationItem, Product } from "types"

export const GITHUB_ISSUES_LINK =
  "https://github.com/medusajs/medusa/issues/new/choose"

export const navDropdownItems: NavigationItem[] = [
  {
    type: "link",
    link: `/learn`,
    title: "Get Started",
    sidebar_id: "docs",
  },
  {
    type: "dropdown",
    title: "Product",
    children: [
      {
        type: "sub-menu",
        title: "Framework",
        link: "/learn/fundamentals/framework",
        items: [
          {
            type: "link",
            title: "API Routes",
            link: "/learn/fundamentals/api-routes",
          },
          {
            type: "link",
            title: "Data Models",
            link: "/learn/fundamentals/data-models",
          },
          {
            type: "link",
            title: "Events and Subscribers",
            link: "/learn/fundamentals/events-and-subscribers",
          },
          {
            type: "link",
            title: "Index Module",
            link: "/learn/fundamentals/module-links/index-module",
          },
          {
            type: "link",
            title: "AcmeKit Container",
            link: "/learn/fundamentals/medusa-container",
          },
          {
            type: "link",
            title: "Modules",
            link: "/learn/fundamentals/modules",
          },
          {
            type: "link",
            title: "Module Links",
            link: "/learn/fundamentals/module-links",
          },
          {
            type: "link",
            title: "Plugins",
            link: "/learn/fundamentals/plugins",
          },
          {
            type: "link",
            title: "Query",
            link: "/learn/fundamentals/module-links/query",
          },
          {
            type: "link",
            title: "Scheduled Jobs",
            link: "/learn/fundamentals/scheduled-jobs",
          },
          {
            type: "link",
            title: "Workflows",
            link: "/learn/fundamentals/workflows",
          },
        ],
      },
      {
        type: "link",
        title: "Admin Extensions",
        link: "/learn/fundamentals/admin",
      },
      {
        type: "sub-menu",
        title: "Infrastructure Modules",
        link: "/resources/infrastructure-modules",
        sidebar_id: "infrastructure-modules",
        items: [
          {
            type: "link",
            title: "Analytics",
            link: "/resources/infrastructure-modules/analytics",
          },
          {
            type: "link",
            title: "Caching",
            link: "/resources/infrastructure-modules/caching",
          },
          {
            type: "link",
            title: "Event",
            link: "/resources/infrastructure-modules/event",
          },
          {
            type: "link",
            title: "File",
            link: "/resources/infrastructure-modules/file",
          },
          {
            type: "link",
            title: "Locking",
            link: "/resources/infrastructure-modules/locking",
          },
          {
            type: "link",
            title: "Notification",
            link: "/resources/infrastructure-modules/notification",
          },
          {
            type: "link",
            title: "Workflow Engine",
            link: "/resources/infrastructure-modules/workflow-engine",
          },
        ],
      },
    ],
  },
  {
    type: "dropdown",
    title: "Build",
    children: [
      {
        type: "link",
        title: "How-to & Tutorials",
        link: "/resources/how-to-tutorials",
        sidebar_id: "how-to-tutorials",
      },
      {
        type: "link",
        title: "Integrations",
        link: "/resources/integrations",
        sidebar_id: "integrations",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Tools",
    link: "/resources/tools",
    children: [
      {
        type: "sub-menu",
        title: "CLI Tools",
        items: [
          {
            type: "link",
            title: "create-acmekit-app",
            link: "/resources/create-medusa-app",
          },
          {
            type: "link",
            title: "AcmeKit CLI",
            link: "/resources/medusa-cli",
          },
        ],
      },
      {
        type: "link",
        title: "JS SDK",
        link: "/resources/js-sdk",
        sidebar_id: "js-sdk",
      },
      {
        type: "link",
        title: "AcmeKit UI",
        link: "/ui",
        sidebar_id: "ui",
      },
    ],
  },
  {
    type: "dropdown",
    title: "Reference",
    link: "/resources/references-overview",
    children: [
      {
        type: "link",
        title: "Admin API",
        link: "/api/admin",
        sidebar_id: "admin",
      },
      {
        type: "link",
        title: "Client API",
        link: "/api/client",
        sidebar_id: "client",
      },
      {
        type: "divider",
      },
      {
        type: "link",
        title: "Admin Injection Zones",
        link: "/resources/admin-widget-injection-zones",
      },
      {
        type: "link",
        title: "Container Resources",
        link: "/resources/medusa-container-resources",
      },
      {
        type: "link",
        title: "Core Workflows",
        link: "/resources/medusa-workflows-reference",
        sidebar_id: "core-flows",
      },
      {
        type: "link",
        title: "Data Model Language",
        link: "/resources/references/data-model",
        sidebar_id: "dml-reference",
      },
      {
        type: "link",
        title: "Data Model Repository",
        link: "/resources/data-model-repository-reference",
        sidebar_id: "data-model-repository-reference",
      },
      {
        type: "link",
        title: "Events Reference",
        link: "/resources/references/events",
      },
      {
        type: "link",
        title: "Helper Steps",
        link: "/resources/references/helper-steps",
        sidebar_id: "helper-steps-reference",
      },
      {
        type: "link",
        title: "Service Factory",
        link: "/resources/service-factory-reference",
        sidebar_id: "service-factory-reference",
      },
      {
        type: "link",
        title: "Testing Framework",
        link: "/resources/test-tools-reference",
        sidebar_id: "test-tools-reference",
      },
      {
        type: "link",
        title: "Workflows SDK",
        link: "/resources/references/workflows",
        sidebar_id: "workflows-sdk-reference",
      },
    ],
  },
]

export const products: Product[] = []

export enum DocsTrackingEvents {
  SURVEY = "survey",
  SURVEY_API = "survey_api-ref",
  CODE_BLOCK_COPY = "code_block_copy",
  AI_ASSISTANT_START_CHAT = "ai_assistant_start_chat",
  AI_ASSISTANT_CALLOUT_CLICK = "ai_assistant_callout_click",
  SEARCH_CALLOUT_CLICK = "search_callout_click",
  BLOOM_ACTION = "bloom_action",
}
