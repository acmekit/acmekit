/** @type {import('types').Sidebar.SidebarItem[]} */
export const howToTutorialsSidebar = [
  {
    type: "link",
    path: "/how-to-tutorials",
    title: "Overview",
  },
  {
    type: "link",
    path: "/examples",
    title: "Example Snippets",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "How-To Guides",
    description:
      "How-to guides are a collection of guides that help you understand how to achieve certain customizations or implementing specific features in AcmeKit.",
    children: [
      {
        type: "sub-category",
        title: "Server",
        autogenerate_tags: "howTo+server",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "These how-to guides help you customize the AcmeKit server to implement custom features and business logic.",
      },
      {
        type: "sub-category",
        title: "Admin",
        autogenerate_tags: "howTo+admin",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "These how-to guides help you customize the AcmeKit Admin dashboard with practical examples.",
        children: [
          {
            type: "sidebar",
            sidebar_id: "admin-components-layouts",
            title: "Components & Layouts",
            children: [
              {
                type: "link",
                path: "/admin-components",
                title: "Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Layouts",
                autogenerate_path: "/admin-components/layouts",
              },
              {
                type: "category",
                title: "Components",
                autogenerate_path: "/admin-components/components",
              },
            ],
          },
          {
            type: "link",
            title: "Custom Admin Authentication",
            path: "/how-to-tutorials/how-to/admin/auth",
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Deployment",
    children: [
      {
        type: "link",
        path: "/deployment",
        title: "Overview",
      },
    ],
  },
]
