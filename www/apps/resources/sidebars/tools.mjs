/** @type {import('types').Sidebar.SidebarItem[]} */
export const toolsSidebar = [
  {
    type: "link",
    title: "Overview",
    path: "/tools",
  },
  {
    type: "category",
    title: "CLI Tools",
    initialOpen: true,
    description:
      "CLI tools help you setup Medusa, manage the database, and more.",
    children: [
      {
        type: "link",
        path: "/create-medusa-app",
        title: "create-medusa-app",
      },
      {
        type: "sidebar",
        sidebar_id: "medusa-cli",
        title: "Medusa CLI",
        childSidebarTitle: "Medusa CLI Reference",
        initialOpen: true,
        children: [
          {
            type: "link",
            path: "/medusa-cli",
            title: "Overview",
          },
          {
            type: "separator",
          },
          {
            type: "category",
            title: "Commands",
            autogenerate_path: "medusa-cli/commands",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "SDKs",
    initialOpen: true,
    description:
      "SDKs help you build client applications, such as admin dashboards, with AcmeKit. They're also useful when extending the AcmeKit Admin with widgets and UI routes.",
    children: [
      {
        type: "sidebar",
        sidebar_id: "js-sdk",
        title: "JS SDK",
        childSidebarTitle: "JS SDK Reference",
        children: [
          {
            type: "link",
            path: "/js-sdk",
            title: "Overview",
          },
          {
            type: "link",
            path: "/js-sdk/auth/overview",
            title: "Authentication",
          },
          {
            type: "separator",
          },
          {
            type: "category",
            title: "auth Methods",
            autogenerate_path: "/references/js_sdk/auth/Auth/methods",
          },
          {
            type: "category",
            title: "store Methods",
            autogenerate_path: "/references/js_sdk/store/Store/properties",
          },
          {
            type: "category",
            title: "admin Methods",
            autogenerate_path: "/references/js_sdk/admin/Admin/properties",
          },
        ],
      },
    ],
  },
  {
    type: "external",
    title: "Medusa UI",
    path: "https://docs.medusajs.com/ui",
  },
]
