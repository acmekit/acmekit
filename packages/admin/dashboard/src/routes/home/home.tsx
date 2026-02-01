import { Container, Heading, Text } from "@acmekit/ui"
import { useTranslation } from "react-i18next"

export const Home = () => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-col items-center justify-center gap-y-4 px-6 py-16">
        <Heading level="h1">{t("app.home.welcome", "Welcome")}</Heading>
        <Text size="small" className="text-ui-fg-muted text-center">
          {t(
            "app.home.empty",
            "Add plugins to your admin to get started. Plugins can add routes, settings, and features."
          )}
        </Text>
      </div>
    </Container>
  )
}
