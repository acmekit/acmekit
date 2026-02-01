/** @type {import('types').Sidebar.RawSidebar[]} */
export const sidebar = [
  {
    sidebar_id: "user-guide",
    title: "User Guide",
    items: [
      {
        type: "link",
        path: "/",
        title: "Introduction",
      },
      {
        type: "link",
        path: "/reset-password",
        title: "Reset Password",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Tips",
        autogenerate_path: "/tips",
      },
      {
        type: "category",
        title: "Settings",
        children: [
          {
            type: "link",
            title: "Overview",
            path: "/settings",
          },
          {
            type: "link",
            title: "Store",
            path: "/settings/store",
          },
          {
            type: "link",
            title: "Users",
            path: "/settings/users",
            children: [
              {
                type: "link",
                title: "Manage Invites",
                path: "/settings/users/invites",
              },
            ],
          },
          {
            type: "link",
            title: "Translations",
            path: "/settings/translations",
          },
          {
            type: "link",
            title: "Developer Settings",
            path: "/settings/developer",
            children: [
              {
                type: "link",
                title: "Publishable API Keys",
                path: "/settings/developer/publishable-api-keys",
              },
              {
                type: "link",
                title: "Secret API Keys",
                path: "/settings/developer/secret-api-keys",
              },
              {
                type: "link",
                title: "Workflows",
                path: "/settings/developer/workflows",
              },
            ],
          },
          {
            type: "link",
            title: "Profile",
            path: "/settings/profile",
          },
        ],
      },
    ],
  },
]
