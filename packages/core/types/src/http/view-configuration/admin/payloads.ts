export interface AdminCreateViewConfiguration {
  /**
   * The name of the view configuration.
   */
  name?: string | null
  /**
   * Whether this is a system default configuration.
   */
  is_system_default?: boolean
  /**
   * Whether to set this view as the active view after creation.
   */
  set_active?: boolean
  /**
   * The view configuration settings.
   */
  configuration: {
    /**
     * The list of visible column IDs.
     */
    visible_columns: string[]
    /**
     * The order of columns.
     */
    column_order: string[]
    /**
     * Custom column widths.
     */
    column_widths?: Record<string, number>
    /**
     * Active filters for the view.
     */
    filters?: Record<string, any>
    /**
     * Sorting configuration.
     */
    sorting?: {
      id: string
      desc: boolean
    } | null
    /**
     * Search query for the view.
     */
    search?: string
  }
}

export interface AdminUpdateViewConfiguration {
  /**
   * The name of the view configuration.
   */
  name?: string | null
  /**
   * Whether this is a system default configuration.
   */
  is_system_default?: boolean
  /**
   * Whether to set this view as the active view after update.
   */
  set_active?: boolean
  /**
   * The view configuration settings.
   */
  configuration?: {
    /**
     * The list of visible column IDs.
     */
    visible_columns?: string[]
    /**
     * The order of columns.
     */
    column_order?: string[]
    /**
     * Custom column widths.
     */
    column_widths?: Record<string, number>
    /**
     * Active filters for the view.
     */
    filters?: Record<string, any>
    /**
     * Sorting configuration.
     */
    sorting?: {
      id: string
      desc: boolean
    } | null
    /**
     * Search query for the view.
     */
    search?: string
  }
}

export interface AdminSetActiveViewConfiguration {
  /**
   * The entity to set the active view for.
   */
  entity: string
  /**
   * The ID of the view configuration to set as active, or null to clear the active view.
   */
  view_configuration_id: string | null
}
