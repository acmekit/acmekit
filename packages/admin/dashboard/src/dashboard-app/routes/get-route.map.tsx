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
