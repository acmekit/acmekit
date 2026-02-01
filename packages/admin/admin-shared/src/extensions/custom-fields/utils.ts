import {
  CUSTOM_FIELD_CONTAINER_ZONES,
  CUSTOM_FIELD_DISPLAY_PATHS,
  CUSTOM_FIELD_FORM_CONFIG_PATHS,
  CUSTOM_FIELD_FORM_FIELD_PATHS,
  CUSTOM_FIELD_FORM_TABS,
  CUSTOM_FIELD_FORM_ZONES,
  CUSTOM_FIELD_LINK_PATHS,
  CUSTOM_FIELD_MODELS,
} from "./constants"
import {
  CustomFieldContainerZone,
  CustomFieldFormTab,
  CustomFieldFormZone,
  CustomFieldModel,
} from "./types"

// Validators for individual segments of the custom field extension system.
// With no built-in models (plugin-agnostic), these return false until plugins register.

export function isValidCustomFieldModel(id: any): id is CustomFieldModel {
  return (CUSTOM_FIELD_MODELS as readonly unknown[]).includes(id)
}

export function isValidCustomFieldFormZone(id: any): id is CustomFieldFormZone {
  return (CUSTOM_FIELD_FORM_ZONES as readonly unknown[]).includes(id)
}

export function isValidCustomFieldFormTab(id: any): id is CustomFieldFormTab {
  return (CUSTOM_FIELD_FORM_TABS as readonly unknown[]).includes(id)
}

export function isValidCustomFieldDisplayZone(
  id: any
): id is CustomFieldContainerZone {
  return (CUSTOM_FIELD_CONTAINER_ZONES as readonly unknown[]).includes(id)
}

// Validators for full paths of custom field extensions

export function isValidCustomFieldDisplayPath(id: any): id is string {
  return (CUSTOM_FIELD_DISPLAY_PATHS as readonly unknown[]).includes(id)
}

export function isValidCustomFieldFormConfigPath(id: any): id is string {
  return (CUSTOM_FIELD_FORM_CONFIG_PATHS as readonly unknown[]).includes(id)
}

export function isValidCustomFieldFormFieldPath(id: any): id is string {
  return (CUSTOM_FIELD_FORM_FIELD_PATHS as readonly unknown[]).includes(id)
}

export function isValidCustomFieldLinkPath(id: any): id is string {
  return (CUSTOM_FIELD_LINK_PATHS as readonly unknown[]).includes(id)
}
