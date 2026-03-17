import { BaseFilterable } from "../dal"

/**
 * The view configuration data model.
 */
export interface ViewConfigurationDTO {
  /**
   * The ID of the configuration.
   */
  id: string

  /**
   * The entity this configuration is for.
   */
  entity: string

  /**
   * The name of the configuration.
   */
  name: string

  /**
   * The user ID this configuration belongs to.
   */
  user_id: string | null

  /**
   * Whether this is a system default configuration.
   */
  is_system_default: boolean

  /**
   * The configuration data.
   */
  configuration: {
    /**
     * The visible columns.
     */
    visible_columns: string[]

    /**
     * The column order.
     */
    column_order: string[]

    /**
     * The column widths.
     */
    column_widths?: Record<string, number>

    /**
     * The filters to apply.
     */
    filters?: Record<string, any>

    /**
     * The sorting configuration.
     */
    sorting?: { id: string; desc: boolean } | null

    /**
     * The search string.
     */
    search?: string
  }

  /**
   * The date the configuration was created.
   */
  created_at: Date

  /**
   * The date the configuration was last updated.
   */
  updated_at: Date
}

/**
 * The user preference data model.
 */
export interface UserPreferenceDTO {
  /**
   * The ID of the preference.
   */
  id: string

  /**
   * The user ID.
   */
  user_id: string

  /**
   * The preference key.
   */
  key: string

  /**
   * The preference value.
   */
  value: any

  /**
   * The date the preference was created.
   */
  created_at: Date

  /**
   * The date the preference was last updated.
   */
  updated_at: Date
}

/**
 * Partial filters for view configuration fields.
 */
export interface ViewConfigurationFilterableFields {
  /**
   * The IDs to filter by.
   */
  id?: string | string[]

  /**
   * Filter by entity name.
   */
  entity?: string | string[]

  /**
   * Filter by user ID.
   */
  user_id?: string | string[] | null

  /**
   * Filter by system default flag.
   */
  is_system_default?: boolean

  /**
   * Filter by name.
   */
  name?: string | string[]
}

/**
 * The filters to apply on the retrieved view configurations.
 */
export interface FilterableViewConfigurationProps extends ViewConfigurationFilterableFields {
  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "and" condition.
   */
  $and?: (ViewConfigurationFilterableFields | FilterableViewConfigurationProps)[]

  /**
   * An array of filters to apply on the entity, where each item in the array is joined with an "or" condition.
   */
  $or?: (ViewConfigurationFilterableFields | FilterableViewConfigurationProps)[]
}

/**
 * The filters to apply on the retrieved user preferences.
 */
export interface FilterableUserPreferenceProps extends BaseFilterable<UserPreferenceDTO> {
  /**
   * The IDs to filter by.
   */
  id?: string | string[]

  /**
   * Filter by user ID.
   */
  user_id?: string | string[]

  /**
   * Filter by preference key.
   */
  key?: string | string[]
}