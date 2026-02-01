import { keepPreviousData } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { RouteFocusModal } from "../../../components/modals"
import {
  useLocales,
  useReferenceTranslations,
  useTranslationSettings,
} from "../../../hooks/api"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import { TranslationsEditForm } from "./components/translations-edit-form"

export const TranslationsEdit = () => {
  const isTranslationsEnabled = useFeatureFlag("translation")
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reference = searchParams.get("reference")
  const referenceIdParam = searchParams.getAll("reference_id")

  useEffect(() => {
    if (!reference || !isTranslationsEnabled) {
      navigate(-1)
      return
    }
  }, [reference, navigate, isTranslationsEnabled])

  const {
    translation_settings,
    isPending: isTranslationSettingsPending,
    isError: isTranslationSettingsError,
    error: translationSettingsError,
  } = useTranslationSettings({ entity_type: reference! })

  const {
    translations,
    references,
    fetchNextPage,
    count,
    isFetchingNextPage,
    hasNextPage,
    isPending,
    isError,
    error,
  } = useReferenceTranslations(reference!, referenceIdParam, {
    enabled: !!reference,
    placeholderData: keepPreviousData,
  })
  const {
    locales: localesList,
    isPending: isLocalesPending,
    isError: isLocalesError,
    error: localesError,
  } = useLocales()

  const availableLocales =
    localesList?.map((l) => ({ locale_code: l.code, locale: l.code })) ?? []

  const ready =
    !isPending &&
    !!translations &&
    !!translation_settings &&
    !isTranslationSettingsPending &&
    !!references &&
    !isLocalesPending &&
    !!localesList

  if (isError || isLocalesError || isTranslationSettingsError) {
    throw error || localesError || translationSettingsError
  }

  return (
    <RouteFocusModal prev={referenceIdParam.length ? -1 : ".."}>
      {ready && (
        <TranslationsEditForm
          translations={translations}
          references={references}
          entityType={reference!}
          availableLocales={availableLocales}
          translatableFields={translation_settings[reference!]?.fields ?? []}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          referenceCount={count}
        />
      )}
    </RouteFocusModal>
  )
}
