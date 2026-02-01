import { Alert, Button, Container, Heading, Text } from "@acmekit/ui"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import {
  useLocales,
  useTranslationSettings,
  useTranslationStatistics,
} from "../../../hooks/api"
import { ActiveLocalesSection } from "./components/active-locales-section/active-locales-section"
import { TranslationListSection } from "./components/translation-list-section/translation-list-section"
import { TranslationsCompletionSection } from "./components/translations-completion-section/translations-completion-section"
import { ListCheckbox } from "@acmekit/icons"

export type TranslatableEntity = {
  label: string
  reference: string
  translatableFields: string[]
  translatedCount?: number
  totalCount?: number
}

export const TranslationList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { locales: localesList, isPending, isError, error } = useLocales()
  const supportedLocales =
    localesList?.map((l) => ({ locale_code: l.code, locale: l.code })) ?? []
  const {
    translation_settings,
    isPending: isTranslationSettingsPending,
    isError: isTranslationSettingsError,
    error: translationSettingsError,
  } = useTranslationSettings({
    is_active: true,
  })
  const {
    statistics,
    isPending: isTranslationStatisticsPending,
    isError: isTranslationStatisticsError,
    error: translationStatisticsError,
  } = useTranslationStatistics(
    {
      locales: supportedLocales.map((l) => l.locale_code),
      entity_types: Object.keys(translation_settings ?? {}),
    },
    {
      enabled:
        !!translation_settings && supportedLocales.length > 0,
    }
  )

  if (isError || isTranslationSettingsError || isTranslationStatisticsError) {
    throw error || translationSettingsError || translationStatisticsError
  }

  const hasLocales = supportedLocales.length > 0

  const translatableEntities: TranslatableEntity[] = useMemo(() => {
    if (!translation_settings) {
      return []
    }

    return (
      Object.entries(translation_settings)
        .filter(
          ([entity]) =>
            !["product_option", "product_option_value"].includes(entity)
        )
        .map(([entity, setting]) => {
          const entityStatistics = statistics?.[entity] ?? {
            translated: 0,
            expected: 0,
          }

          return {
            label: entity
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
            reference: entity,
            translatableFields: setting.fields,
            translatedCount: entityStatistics.translated,
            totalCount: entityStatistics.expected,
          }
        })
        // sort by label alphabetically
        .sort((a, b) => a.label.localeCompare(b.label))
    )
  }, [translation_settings, statistics])

  const handleManageLocales = useCallback(() => {
    navigate("/settings/translations/add-locales")
  }, [navigate])

  const handleManageEntities = useCallback(() => {
    navigate("/settings/translations/settings")
  }, [navigate])

  const isReady =
    !!localesList &&
    !isPending &&
    !isTranslationSettingsPending &&
    !!translation_settings &&
    ((!!statistics && !isTranslationStatisticsPending) || !hasLocales)

  if (!isReady) {
    return <TwoColumnPageSkeleton sidebarSections={2} />
  }

  return (
    <TwoColumnPage
      widgets={{
        before: [],
        after: [],
        sideBefore: [],
        sideAfter: [],
      }}
    >
      <TwoColumnPage.Main>
        <Container className="flex items-center justify-between px-6 py-4">
          <div className="flex flex-col">
            <Heading>Manage {t("translations.domain")}</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              {t("translations.subtitle")}
            </Text>
          </div>
          <Button
            size="small"
            variant="secondary"
            onClick={handleManageEntities}
          >
            <ListCheckbox className="text-ui-fg-subtle" />
            <Text className="txt-compact-small-plus text-ui-fg-base">
              {t("translations.actions.manageEntities")}
            </Text>
          </Button>
        </Container>

        {!hasLocales && (
          <Alert
            variant="info"
            className="bg-ui-bg-base flex items-center px-6 py-4"
          >
            <div className="flex items-center justify-between gap-x-2">
              <p>{t("translations.activeLocales.noLocalesTip")}.</p>
              <Button
                onClick={handleManageLocales}
                size="small"
                variant="secondary"
              >
                {t("translations.activeLocales.noLocalesTipConfigureAction")}
              </Button>
            </div>
          </Alert>
        )}

        <TranslationListSection
          entities={translatableEntities}
          hasLocales={hasLocales}
        />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <ActiveLocalesSection
          locales={supportedLocales.map((l) => l.locale)}
        ></ActiveLocalesSection>
        <TranslationsCompletionSection
          statistics={statistics ?? {}}
          locales={supportedLocales.map((l) => l.locale)}
        />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
