import { PencilSquare } from "@acmekit/icons"
import { AdminStore } from "@acmekit/types"
import { Container, Heading, Text } from "@acmekit/ui"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"

type StoreGeneralSectionProps = {
  store: AdminStore
}

export const StoreGeneralSection = ({ store }: StoreGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("store.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("store.manageYourStoresDetails")}
          </Text>
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: "edit",
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text size="small" leading="compact">
          {store.name}
        </Text>
      </div>
    </Container>
  )
}
