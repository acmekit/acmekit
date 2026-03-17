import {
  GraphQLObjectType,
  isEnumType,
  isListType,
  isNonNullType,
  isScalarType,
  makeExecutableSchema,
  mergeTypeDefs,
  graphqlSchemaToFields,
  extractRelationsFromGQL,
  cleanGraphQLSchema,
  print,
} from "@medusajs/framework/utils"
import { HttpTypes } from "@medusajs/types"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ENTITY_MAPPINGS } from "./entity-mappings"

// Determine column category based on field characteristics
export const getColumnCategory = (
  fieldName: string,
  dataType: string,
  semanticType?: string
): HttpTypes.AdminColumn["category"] => {
  // Check semantic type first
  if (semanticType === "timestamp") {
    return "timestamp"
  }
  if (semanticType === "status") {
    return "status"
  }

  // Check field name patterns
  if (
    fieldName.includes("_id") ||
    fieldName === "id" ||
    fieldName.includes("display_id") ||
    fieldName.includes("custom_display_id") ||
    fieldName === "code"
  ) {
    return "identifier"
  }

  if (fieldName.includes("status") || fieldName === "state") {
    return "status"
  }

  if (fieldName.includes("_at") || fieldName.includes("date")) {
    return "timestamp"
  }

  if (
    fieldName.includes("total") ||
    fieldName.includes("amount") ||
    fieldName.includes("price") ||
    semanticType === "currency"
  ) {
    return "metric"
  }

  if (dataType === "object" || fieldName.includes("_display")) {
    return "relationship"
  }

  return "metadata"
}

// Helper function to format field name for display
export const formatFieldName = (field: string): string => {
  return field
    .split(/[._]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Helper function to get the underlying type from wrapped types (NonNull, List)
export const getUnderlyingType = (type: any): any => {
  if (type.ofType) {
    return getUnderlyingType(type.ofType)
  }
  return type
}

// Helper function to check if a field type is an array/list
export const isArrayField = (type: any): boolean => {
  if (isListType(type)) {
    return true
  }
  if (isNonNullType(type)) {
    return isArrayField(type.ofType)
  }
  return false
}

// Helper function to check if a field is a single relationship (many-to-one, one-to-one)
export const isSingleRelationship = (type: any): boolean => {
  // If it's a list, it's a one-to-many or many-to-many relationship
  if (isArrayField(type)) {
    return false
  }

  // Get the underlying type (removing NonNull wrappers)
  const underlyingType = getUnderlyingType(type)

  // Check if it's a GraphQL object type (relationship)
  return underlyingType instanceof GraphQLObjectType
}

// Helper function to check if a field should be excluded based on filtering rules
export const shouldExcludeField = (
  fieldName: string,
  fieldFilters: any
): boolean => {
  // Check if field matches any exclude suffixes
  if (
    fieldFilters.excludeSuffixes?.some((suffix: string) =>
      fieldName.endsWith(suffix)
    )
  ) {
    return true
  }

  // Check if field matches any exclude prefixes
  if (
    fieldFilters.excludePrefixes?.some((prefix: string) =>
      fieldName.startsWith(prefix)
    )
  ) {
    return true
  }

  // Check if field is in the exclude fields list
  if (fieldFilters.excludeFields?.includes(fieldName)) {
    return true
  }

  return false
}

// Helper function to determine data type and semantic type from GraphQL type
export const getTypeInfoFromGraphQLType = (
  type: any,
  fieldName: string
): {
  data_type: HttpTypes.AdminColumn["data_type"]
  semantic_type: string
  context?: string
} => {
  const underlyingType = type ? getUnderlyingType(type) : null

  // Check field name patterns first for more specific types
  if (fieldName.includes("_at") || fieldName.includes("date")) {
    return {
      data_type: "date",
      semantic_type: "timestamp",
      context: fieldName.includes("created")
        ? "creation"
        : fieldName.includes("updated")
        ? "update"
        : "generic",
    }
  } else if (
    fieldName.includes("total") ||
    fieldName.includes("amount") ||
    fieldName.includes("price")
  ) {
    return {
      data_type: "currency",
      semantic_type: "currency",
      context: fieldName.includes("total") ? "total" : "amount",
    }
  } else if (fieldName.includes("count") || fieldName.includes("quantity")) {
    return {
      data_type: "number",
      semantic_type: "count",
      context: fieldName.includes("quantity") ? "quantity" : "count",
    }
  } else if (fieldName.includes("status")) {
    return {
      data_type: "enum",
      semantic_type: "status",
      context: fieldName.includes("payment")
        ? "payment"
        : fieldName.includes("fulfillment")
        ? "fulfillment"
        : "generic",
    }
  } else if (fieldName.includes("type") || fieldName.includes("is_")) {
    return {
      data_type: "enum",
      semantic_type: "enum",
      context: "generic",
    }
  } else if (fieldName === "metadata" || fieldName.includes("json")) {
    return {
      data_type: "object",
      semantic_type: "object",
      context: "metadata",
    }
  } else if (fieldName === "display_id" || fieldName === "custom_display_id") {
    return {
      data_type: "string",
      semantic_type: "identifier",
      context: "order",
    }
  } else if (fieldName === "email") {
    return {
      data_type: "string",
      semantic_type: "email",
      context: "contact",
    }
  }

  // Then check GraphQL type
  if (underlyingType && isScalarType(underlyingType)) {
    switch (underlyingType.name) {
      case "Int":
      case "Float":
        return {
          data_type: "number",
          semantic_type: "number",
          context: "generic",
        }
      case "Boolean":
        return {
          data_type: "boolean",
          semantic_type: "boolean",
          context: "generic",
        }
      case "DateTime":
        return {
          data_type: "date",
          semantic_type: "timestamp",
          context: "generic",
        }
      case "JSON":
        return {
          data_type: "object",
          semantic_type: "object",
          context: "json",
        }
      default:
        return {
          data_type: "string",
          semantic_type: "string",
          context: "generic",
        }
    }
  } else if (underlyingType && isEnumType(underlyingType)) {
    return {
      data_type: "enum",
      semantic_type: "enum",
      context: "generic",
    }
  } else {
    return {
      data_type: "object",
      semantic_type: "object",
      context: "relationship",
    }
  }
}

type Entities = keyof typeof ENTITY_MAPPINGS

const ADDITIONAL_ENTITY_TYPES: Partial<Record<Entities, string[]>> = {
  orders: ["OrderDetail"],
}

export const DEFAULT_COLUMN_ORDERS: Record<Entities, Record<string, number>> = {
  orders: {
    display_id: 100,
    custom_display_id: 101,
    created_at: 200,
    customer_display: 300,
    "sales_channel.name": 400,
    fulfillment_status: 500,
    payment_status: 600,
    total: 700,
    country: 800,
  },
  products: {
    product_display: 100,
    "collection.title": 200,
    sales_channels_display: 300,
    variants_count: 400,
    status: 500,
  },
  // Add other entities as needed
  customers: {},
  users: {},
  regions: {},
  "sales-channels": {},
}

/**
 * Generates columns for a given entity by introspecting the GraphQL schema
 * @param entity - The entity name to generate columns for
 * @param entityMapping - The entity mapping configuration
 * @returns Array of columns or null if generation fails
 */
export const generateEntityColumns = (
  entity: string,
  entityMapping: (typeof ENTITY_MAPPINGS)[keyof typeof ENTITY_MAPPINGS]
): HttpTypes.AdminColumn[] | null => {
  const joinerConfigs = MedusaModule.getAllJoinerConfigs()

  const schemaFragments: string[] = []
  let hasEntityType = false

  for (const config of joinerConfigs) {
    if (config.schema) {
      schemaFragments.push(config.schema)

      if (config.schema.includes(`type ${entityMapping.graphqlType} {`)) {
        hasEntityType = true
      }
    }
  }

  if (!hasEntityType || schemaFragments.length === 0) {
    return null
  }

  const scalarDefinitions = `
    scalar DateTime
    scalar JSON
  `

  const allSchemas = [scalarDefinitions, ...schemaFragments]
  const mergedSchemaAST = mergeTypeDefs(allSchemas)
  const mergedSchemaString = print(mergedSchemaAST)

  const { schema: cleanedSchemaString } = cleanGraphQLSchema(mergedSchemaString)

  const schema = makeExecutableSchema({
    typeDefs: cleanedSchemaString,
    resolvers: {}, // Empty resolvers since we only need the schema for introspection
  })

  const schemaTypeMap = schema.getTypeMap()

  const entityType = schemaTypeMap[
    entityMapping.graphqlType
  ] as GraphQLObjectType

  const entityFields = entityType?.getFields?.() ?? {}
  const additionalFieldDefinitions = new Map<
    string,
    ReturnType<GraphQLObjectType["getFields"]>[string]
  >()

  const allDirectFields = graphqlSchemaToFields(
    schemaTypeMap,
    entityMapping.graphqlType,
    []
  )

  // Filter out problematic fields
  const directFields = allDirectFields.filter((fieldName) => {
    const field = entityFields[fieldName]
    if (!field) return true

    const isArray = isArrayField(field.type)
    if (isArray) {
      return false
    }

    if (shouldExcludeField(fieldName, entityMapping.fieldFilters)) {
      return false
    }

    return true
  })

  if (entity === "orders" && !directFields.includes("display_id")) {
    directFields.unshift("display_id")
  }

  if (entity === "orders" && !directFields.includes("custom_display_id")) {
    directFields.unshift("custom_display_id")
  }

  const additionalTypes = ADDITIONAL_ENTITY_TYPES[entity as Entities] ?? []

  additionalTypes.forEach((typeName) => {
    const additionalType = schemaTypeMap[typeName] as
      | GraphQLObjectType
      | undefined
    if (!additionalType) {
      return
    }

    const additionalFields = graphqlSchemaToFields(schemaTypeMap, typeName, [])

    additionalFields.forEach((fieldName) => {
      if (directFields.includes(fieldName)) {
        return
      }

      const field = additionalType.getFields()[fieldName]

      if (field) {
        const isArray = isArrayField(field.type)
        if (isArray) {
          return
        }
      }

      if (shouldExcludeField(fieldName, entityMapping.fieldFilters)) {
        return
      }

      directFields.push(fieldName)

      if (field) {
        additionalFieldDefinitions.set(fieldName, field)
      }
    })
  })

  const relationMap = extractRelationsFromGQL(
    new Map(Object.entries(schemaTypeMap))
  )
  const allEntityRelations = relationMap.get(entityMapping.graphqlType)

  const filteredUtilityRelations = new Map<string, string>()
  if (allEntityRelations && entityType) {
    const fields = entityType.getFields()
    for (const [fieldName, relatedTypeName] of allEntityRelations) {
      const field = fields[fieldName]

      if (shouldExcludeField(fieldName, entityMapping.fieldFilters)) {
        continue
      }

      if (field && isSingleRelationship(field.type)) {
        filteredUtilityRelations.set(fieldName, relatedTypeName)
      }
    }
  }

  const manualRelations = new Map<string, string>()
  if (entityType) {
    const fields = entityType.getFields()
    Object.entries(fields).forEach(([fieldName, field]) => {
      if (shouldExcludeField(fieldName, entityMapping.fieldFilters)) {
        return
      }

      if (isSingleRelationship(field.type)) {
        const fieldType = getUnderlyingType(field.type)
        manualRelations.set(fieldName, fieldType.name)
      }
    })
  }

  const finalRelations =
    filteredUtilityRelations.size > 0
      ? filteredUtilityRelations
      : manualRelations

  if (directFields.length === 0) {
    return null
  }

  const directColumns = directFields.map((fieldName) => {
    const displayName = formatFieldName(fieldName)

    const fieldDef =
      entityFields[fieldName] || additionalFieldDefinitions.get(fieldName)
    const typeInfo = fieldDef
      ? getTypeInfoFromGraphQLType(fieldDef.type, fieldName)
      : getTypeInfoFromGraphQLType(null, fieldName)

    const sortable =
      !fieldName.includes("metadata") && typeInfo.data_type !== "object"

    const isDefaultField =
      entityMapping.defaultVisibleFields.includes(fieldName)
    const entityOrders = DEFAULT_COLUMN_ORDERS[entity] || {}
    const defaultOrder = entityOrders[fieldName] || (isDefaultField ? 500 : 850)
    const category = getColumnCategory(
      fieldName,
      typeInfo.data_type,
      typeInfo.semantic_type
    )

    return {
      id: fieldName,
      name: displayName,
      description: `${displayName} field`,
      field: fieldName,
      sortable,
      hideable: true,
      default_visible: entityMapping.defaultVisibleFields.includes(fieldName),
      data_type: typeInfo.data_type,
      semantic_type: typeInfo.semantic_type,
      context: typeInfo.context,
      default_order: defaultOrder,
      category,
    }
  })

  const relationshipColumns: HttpTypes.AdminColumn[] = []

  if (finalRelations.size > 0) {
    for (const [relationName, relatedTypeName] of finalRelations) {
      const allRelatedFields = graphqlSchemaToFields(
        schemaTypeMap,
        relatedTypeName,
        []
      )

      // Filter out problematic fields from related type
      const relatedType = schemaTypeMap[relatedTypeName] as GraphQLObjectType
      const relatedFields = allRelatedFields.filter((fieldName) => {
        const field = relatedType?.getFields()[fieldName]
        if (!field) return true

        const isArray = isArrayField(field.type)
        if (isArray) {
          return false
        }

        // Apply entity-specific field filters to related fields as well
        if (shouldExcludeField(fieldName, entityMapping.fieldFilters)) {
          return false
        }

        return true
      })

      const limitedFields = relatedFields.slice(0, 10)

      limitedFields.forEach((fieldName) => {
        const fieldPath = `${relationName}.${fieldName}`
        const displayName = `${formatFieldName(relationName)} ${formatFieldName(
          fieldName
        )}`

        const relatedType = schemaTypeMap[relatedTypeName] as GraphQLObjectType
        const fieldDef = relatedType?.getFields()?.[fieldName]
        const typeInfo = fieldDef
          ? getTypeInfoFromGraphQLType(fieldDef.type, fieldName)
          : {
              data_type: "string" as const,
              semantic_type: "string",
              context: "generic",
            }

        const sortable = fieldPath.includes(".")
          ? false
          : ["name", "title", "email", "handle"].includes(fieldName)

        const isDefaultVisible =
          entityMapping.defaultVisibleFields.includes(fieldPath)

        // Get default order and category
        // If field is not in default visible fields, place it after country (850)
        const isDefaultField =
          entityMapping.defaultVisibleFields.includes(fieldPath)
        const entityOrders = DEFAULT_COLUMN_ORDERS[entity] || {}
        const defaultOrder =
          entityOrders[fieldPath] || (isDefaultField ? 700 : 850)
        const category = getColumnCategory(
          fieldPath,
          typeInfo.data_type,
          typeInfo.semantic_type
        )

        relationshipColumns.push({
          id: fieldPath,
          name: displayName,
          description: `${displayName} from related ${relatedTypeName}`,
          field: fieldPath,
          sortable,
          hideable: true,
          default_visible: isDefaultVisible,
          data_type: typeInfo.data_type,
          semantic_type: typeInfo.semantic_type,
          context: typeInfo.context,
          relationship: {
            entity: relatedTypeName,
            field: fieldName,
          },
          default_order: defaultOrder,
          category,
        })
      })
    }
  }

  // Generate computed columns
  const computedColumns: HttpTypes.AdminColumn[] = []

  if (entityMapping.computedColumns) {
    for (const [columnId, columnConfig] of Object.entries(
      entityMapping.computedColumns
    )) {
      // Get default order and category for computed columns
      // If field is not in default visible fields, place it after country (850)
      const isDefaultField =
        entityMapping.defaultVisibleFields.includes(columnId)
      const entityOrders = DEFAULT_COLUMN_ORDERS[entity] || {}
      const defaultOrder =
        entityOrders[columnId] || (isDefaultField ? 600 : 850)
      const category = getColumnCategory(columnId, "string", "computed")

      computedColumns.push({
        id: columnId,
        name: columnConfig.name,
        description: `${columnConfig.name} (computed)`,
        field: columnId,
        sortable: false, // Computed columns can't be sorted server-side
        hideable: true,
        default_visible: entityMapping.defaultVisibleFields.includes(columnId),
        data_type: "string", // Computed columns typically output strings
        semantic_type: "computed",
        context: "display",
        computed: {
          type: columnConfig.render_type,
          required_fields: columnConfig.required_fields,
          optional_fields: columnConfig.optional_fields || [],
        },
        default_order: defaultOrder,
        category,
      })
    }
  }

  const allColumns = [
    ...directColumns,
    ...relationshipColumns,
    ...computedColumns,
  ]

  return allColumns
}
