import { HttpTypes } from "@medusajs/types"
import { t } from "i18next"
import { Outlet, RouteObject, UIMatch } from "react-router-dom"
import { ProtectedRoute } from "../../components/authentication/protected-route"
import { MainLayout } from "../../components/layout/main-layout"
import { PublicLayout } from "../../components/layout/public-layout"
import { SettingsLayout } from "../../components/layout/settings-layout"
import { ErrorBoundary } from "../../components/utilities/error-boundary"

export function getRouteMap({
  settingsRoutes,
  coreRoutes,
}: {
  settingsRoutes: RouteObject[]
  coreRoutes: RouteObject[]
}) {
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
            {
              path: "/customers",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("customers.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () => import("../../routes/customers/customer-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import("../../routes/customers/customer-create"),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/customers/customer-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminCustomerResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import("../../routes/customers/customer-edit"),
                    },
                    {
                      path: "create-address",
                      lazy: () =>
                        import(
                          "../../routes/customers/customer-create-address"
                        ),
                    },
                    {
                      path: "add-customer-groups",
                      lazy: () =>
                        import(
                          "../../routes/customers/customers-add-customer-group"
                        ),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/customers/customer-metadata"),
                    },
                  ],
                },
              ],
            },
            {
              path: "/customer-groups",
              errorElement: <ErrorBoundary />,
              handle: {
                breadcrumb: () => t("customerGroups.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import("../../routes/customer-groups/customer-group-list"),
                  children: [
                    {
                      path: "create",
                      lazy: () =>
                        import(
                          "../../routes/customer-groups/customer-group-create"
                        ),
                    },
                  ],
                },
                {
                  path: ":id",
                  lazy: async () => {
                    const { Component, Breadcrumb, loader } = await import(
                      "../../routes/customer-groups/customer-group-detail"
                    )

                    return {
                      Component,
                      loader,
                      handle: {
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminCustomerGroupResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import(
                          "../../routes/customer-groups/customer-group-edit"
                        ),
                    },
                    {
                      path: "add-customers",
                      lazy: () =>
                        import(
                          "../../routes/customer-groups/customer-group-add-customers"
                        ),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import(
                          "../../routes/customer-groups/customer-group-metadata"
                        ),
                    },
                  ],
                },
              ],
            },
            ...coreRoutes,
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      errorElement: <ErrorBoundary />,
      children: [
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
            {
              path: "profile",
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/profile/profile-detail"),
              handle: {
                breadcrumb: () => t("profile.domain"),
              },
              children: [
                {
                  path: "edit",
                  lazy: () => import("../../routes/profile/profile-edit"),
                },
              ],
            },
            {
              path: "users",
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("users.domain"),
              },
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
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminUserResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () => import("../../routes/users/user-edit"),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () => import("../../routes/users/user-metadata"),
                    },
                  ],
                },
              ],
            },
            {
              path: "workflows",
              errorElement: <ErrorBoundary />,
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("workflowExecutions.domain"),
              },
              children: [
                {
                  path: "",
                  lazy: () =>
                    import(
                      "../../routes/workflow-executions/workflow-execution-list"
                    ),
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
                        breadcrumb: (
                          // eslint-disable-next-line max-len
                          match: UIMatch<HttpTypes.AdminWorkflowExecutionResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                },
              ],
            },
            {
              path: "client-api-keys",
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("apiKeyManagement.domain.publishable"),
              },
              children: [
                {
                  path: "",
                  element: <Outlet />,
                  children: [
                    {
                      path: "",
                      lazy: () =>
                        import(
                          "../../routes/api-key-management/api-key-management-list"
                        ),
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
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminApiKeyResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import(
                          "../../routes/api-key-management/api-key-management-edit"
                        ),
                    },
                  ],
                },
              ],
            },
            {
              path: "secret-api-keys",
              element: <Outlet />,
              handle: {
                breadcrumb: () => t("apiKeyManagement.domain.secret"),
              },
              children: [
                {
                  path: "",
                  element: <Outlet />,
                  children: [
                    {
                      path: "",
                      lazy: () =>
                        import(
                          "../../routes/api-key-management/api-key-management-list"
                        ),
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
                        breadcrumb: (
                          match: UIMatch<HttpTypes.AdminApiKeyResponse>
                        ) => <Breadcrumb {...match} />,
                      },
                    }
                  },
                  children: [
                    {
                      path: "edit",
                      lazy: () =>
                        import(
                          "../../routes/api-key-management/api-key-management-edit"
                        ),
                    },
                  ],
                },
              ],
            },
            ...(settingsRoutes.flatMap(r => r?.children || [])),
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
