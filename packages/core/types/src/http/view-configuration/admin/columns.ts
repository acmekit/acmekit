export interface AdminColumn {
  /**
   * The column's unique identifier (e.g., "display_id", "customer.email").
   */
  id: string
  /**
   * The display name for the column.
   */
  name: string
  /**
   * Description of the column.
   */
  description?: string
  /**
   * The field path to access the data.
   */
  field: string
  /**
   * Whether the column can be sorted.
   */
  sortable: boolean
  /**
   * Whether the column can be hidden.
   */
  hideable: boolean
  /**
   * Whether the column is visible by default.
   */
  default_visible: boolean
  /**
   * The data type of the column.
   */
  data_type:
    | "string"
    | "number"
    | "boolean"
    | "date"
    | "currency"
    | "enum"
    | "object"
  /**
   * The semantic type provides additional context about the data.
   */
  semantic_type?: string
  /**
   * Additional context about the column.
   */
  context?: string
  /**
   * Information about computed columns.
   */
  computed?: {
    type: string
    required_fields: string[]
    optional_fields: string[]
  }
  /**
   * Information about relationship columns.
   */
  relationship?: {
    entity: string
    field: string
  }
  /**
   * Default order for sorting columns.
   */
  default_order?: number
  /**
   * Category for grouping columns.
   */
  category?:
    | "identifier"
    | "timestamp"
    | "status"
    | "metric"
    | "relationship"
    | "metadata"
}

export interface AdminViewsEntityColumnsResponse {
  /**
   * The list of available columns for the entity.
   */
  columns: AdminColumn[]
}
