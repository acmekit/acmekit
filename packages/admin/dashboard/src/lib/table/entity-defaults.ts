/**
 * Default fields configuration for each entity type
 * These fields are always fetched to ensure basic functionality
 */
export const ENTITY_DEFAULT_FIELDS = {
  default: {
    properties: ["id", "created_at", "updated_at"],
    relations: [],
  },
} as const

export type EntityType = keyof typeof ENTITY_DEFAULT_FIELDS

/**
 * Get default fields for an entity
 */
export function getEntityDefaultFields(entity: string) {
  const config =
    ENTITY_DEFAULT_FIELDS[entity as EntityType] || ENTITY_DEFAULT_FIELDS.default
  return {
    properties: config.properties,
    relations: config.relations,
    formatted: [...config.properties, ...config.relations].join(","),
  }
}
