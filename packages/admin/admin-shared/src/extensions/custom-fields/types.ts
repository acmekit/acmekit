import {
  CUSTOM_FIELD_CONTAINER_ZONES,
  CUSTOM_FIELD_FORM_TABS,
  CUSTOM_FIELD_FORM_ZONES,
  CUSTOM_FIELD_MODELS,
} from "./constants"

export type CustomFieldModel = (typeof CUSTOM_FIELD_MODELS)[number]

export type CustomFieldFormZone = (typeof CUSTOM_FIELD_FORM_ZONES)[number]

export type CustomFieldFormTab = (typeof CUSTOM_FIELD_FORM_TABS)[number]

export type CustomFieldContainerZone =
  (typeof CUSTOM_FIELD_CONTAINER_ZONES)[number]

export type CustomFieldZone = CustomFieldFormZone | CustomFieldContainerZone

export type CustomFieldImportType = "display" | "field" | "link" | "config"

/** Plugin-provided form zones per model. Empty by default. */
export interface CustomFieldModelFormMap {}

/** Plugin-provided container zones per model. Empty by default. */
export interface CustomFieldModelContainerMap {}

/** Plugin-provided form tabs per model. Empty by default. */
export type CustomFieldModelFormTabsMap = Record<string, never>

export type CustomFieldFormKeys<T extends CustomFieldModel> =
  CustomFieldModelFormMap[T]
