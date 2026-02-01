import { t } from "i18next"
import { Outlet, RouteObject } from "react-router-dom"
import { ProtectedRoute } from "../../components/authentication/protected-route"
import { MainLayout } from "../../components/layout/main-layout"
import { PublicLayout } from "../../components/layout/public-layout"
import { SettingsLayout } from "../../components/layout/settings-layout"
import { ErrorBoundary } from "../../components/utilities/error-boundary"

/**
 * Merges all plugins' settings route children into a single list.
 * Each plugin's settings routes are trees with root path "settings"; we collect all those children.
 */
function mergeSettingsRouteChildren(
  settingsRoutes: RouteObject[]
): RouteObject[] {
  return settingsRoutes
    .filter((r) => r.path === "settings")
    .flatMap((r) => r.children ?? [])
}

/** Default framework settings routes (profile, store, users, api-keys, workflows, translations). */
const defaultSettingsRouteChildren: RouteObject[] = [
  {
    path: "profile",
    errorElement: <ErrorBoundary />,
    lazy: () => import("../../routes/profile/profile-detail"),
    handle: { breadcrumb: () => t("profile.domain") },
    children: [
      {
        path: "edit",
        lazy: () => import("../../routes/profile/profile-edit"),
      },
    ],
  },
  {
    path: "store",
    errorElement: <ErrorBoundary />,
    lazy: () => import("../../routes/store/store-detail"),
    handle: { breadcrumb: () => t("store.domain") },
    children: [
      { path: "edit", lazy: () => import("../../routes/store/store-edit") },
      {
        path: "metadata/edit",
        lazy: () => import("../../routes/store/store-metadata"),
      },
    ],
  },
  {
    path: "users",
    errorElement: <ErrorBoundary />,
    element: <Outlet />,
    handle: { breadcrumb: () => t("users.domain") },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/users/user-list"),
        children: [
          {
            path: "invite",
            lazy: () => import("../../routes/users/user-invite"),
          },
        ],
      },
      {
        path: ":id",
        lazy: async () => {
          const { Component, Breadcrumb, loader } = await import(
            "../../routes/users/user-detail"
          )
          return {
            Component,
            loader,
            handle: {
              breadcrumb: (match: unknown) => (
                <Breadcrumb {...(match as object)} />
              ),
            },
          }
        },
        children: [
          { path: "edit", lazy: () => import("../../routes/users/user-edit") },
          {
            path: "metadata/edit",
            lazy: () => import("../../routes/users/user-metadata"),
          },
        ],
      },
    ],
  },
  {
    path: "publishable-api-keys",
    element: <Outlet />,
    handle: { breadcrumb: () => t("apiKeyManagement.domain.publishable") },
    children: [
      {
        path: "",
        element: <Outlet />,
        children: [
          {
            path: "",
            lazy: () =>
              import("../../routes/api-key-management/api-key-management-list"),
            children: [
              {
                path: "create",
                lazy: () =>
                  import(
                    "../../routes/api-key-management/api-key-management-create"
                  ),
              },
            ],
          },
        ],
      },
      {
        path: ":id",
        lazy: async () => {
          const { Component, Breadcrumb, loader } = await import(
            "../../routes/api-key-management/api-key-management-detail"
          )
          return {
            Component,
            loader,
            handle: {
              breadcrumb: (match: unknown) => (
                <Breadcrumb {...(match as object)} />
              ),
            },
          }
        },
        children: [
          {
            path: "edit",
            lazy: () =>
              import("../../routes/api-key-management/api-key-management-edit"),
          },
        ],
      },
    ],
  },
  {
    path: "secret-api-keys",
    element: <Outlet />,
    handle: { breadcrumb: () => t("apiKeyManagement.domain.secret") },
    children: [
      {
        path: "",
        element: <Outlet />,
        children: [
          {
            path: "",
            lazy: () =>
              import("../../routes/api-key-management/api-key-management-list"),
            children: [
              {
                path: "create",
                lazy: () =>
                  import(
                    "../../routes/api-key-management/api-key-management-create"
                  ),
              },
            ],
          },
        ],
      },
      {
        path: ":id",
        lazy: async () => {
          const { Component, Breadcrumb, loader } = await import(
            "../../routes/api-key-management/api-key-management-detail"
          )
          return {
            Component,
            loader,
            handle: {
              breadcrumb: (match: unknown) => (
                <Breadcrumb {...(match as object)} />
              ),
            },
          }
        },
        children: [
          {
            path: "edit",
            lazy: () =>
              import("../../routes/api-key-management/api-key-management-edit"),
          },
        ],
      },
    ],
  },
  {
    path: "workflows",
    errorElement: <ErrorBoundary />,
    element: <Outlet />,
    handle: { breadcrumb: () => t("workflowExecutions.domain") },
    children: [
      {
        path: "",
        lazy: () =>
          import("../../routes/workflow-executions/workflow-execution-list"),
      },
      {
        path: ":id",
        lazy: async () => {
          const { Component, Breadcrumb, loader } = await import(
            "../../routes/workflow-executions/workflow-execution-detail"
          )
          return {
            Component,
            loader,
            handle: {
              breadcrumb: (match: unknown) => (
                <Breadcrumb {...(match as object)} />
              ),
            },
          }
        },
      },
    ],
  },
  {
    path: "translations",
    errorElement: <ErrorBoundary />,
    handle: { breadcrumb: () => t("translations.domain") },
    children: [
      {
        path: "",
        lazy: () => import("../../routes/translations/translation-list"),
        children: [
          {
            path: "settings",
            lazy: () => import("../../routes/translations/settings"),
          },
        ],
      },
      {
        path: "edit",
        lazy: () => import("../../routes/translations/translations-edit"),
      },
    ],
  },
]

export function getRouteMap({
  settingsRoutes,
  coreRoutes,
}: {
  settingsRoutes: RouteObject[]
  coreRoutes: RouteObject[]
}) {
  const settingsPluginChildren = mergeSettingsRouteChildren(settingsRoutes)

  return [
    {
      element: <ProtectedRoute />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              path: "/",
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/home"),
            },
            ...coreRoutes,
          ],
        },
        {
          path: "/settings",
          handle: {
            breadcrumb: () => t("app.nav.settings.header"),
          },
          element: <SettingsLayout />,
          children: [
            {
              index: true,
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/settings"),
            },
            ...defaultSettingsRouteChildren,
            ...settingsPluginChildren,
          ],
        },
      ],
    },
    {
      element: <PublicLayout />,
      children: [
        {
          errorElement: <ErrorBoundary />,
          children: [
            {
              path: "/login",
              lazy: () => import("../../routes/login"),
            },
            {
              path: "/reset-password",
              lazy: () => import("../../routes/reset-password"),
            },
            {
              path: "/invite",
              lazy: () => import("../../routes/invite"),
            },
            {
              path: "*",
              lazy: () => import("../../routes/no-match"),
            },
          ],
        },
      ],
    },
  ]
}
