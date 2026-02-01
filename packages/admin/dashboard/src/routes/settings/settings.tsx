import { Container, Heading, Text } from "@acmekit/ui"
import { Outlet, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

export const Settings = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const isSettingsIndex = location.pathname === "/settings"

  if (isSettingsIndex) {
    return (
      <Container className="divide-y p-0">
        <div className="flex flex-col items-center justify-center gap-y-4 px-6 py-16">
          <Heading level="h1">{t("app.nav.settings.header")}</Heading>
          <Text size="small" className="text-ui-fg-muted text-center">
            {t(
              "app.settings.empty",
              "Add plugins to see settings here. Plugins can register settings under this section."
            )}
          </Text>
        </div>
      </Container>
    )
  }

  return <Outlet />
}
