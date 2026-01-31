/**
 * This is an optimized mikro orm serializer to create a highly optimized serialization pipeline
 * that leverages V8's JIT compilation and inline caching mechanisms.
 */

import {
  Collection,
  EntityDTO,
  EntityMetadata,
  helper,
  IPrimaryKey,
  Loaded,
  Platform,
  Reference,
  ReferenceKind,
  SerializationContext,
  Utils,
} from "@mikro-orm/core"

const STATIC_OPTIONS_SHAPE: {
  populate: string[] | boolean | undefined
  exclude: string[] | undefined
  preventCircularRef: boolean | undefined
  skipNull: boolean | undefined
  ignoreSerializers: boolean | undefined
  forceObject: boolean | undefined
} = {
  populate: ["*"],
  exclude: undefined,
  preventCircularRef: true,
  skipNull: undefined,
  ignoreSerializers: undefined,
  forceObject: true,
}

const EMPTY_ARRAY: string[] = []

const WILDCARD = "*"
const DOT = "."
const UNDERSCORE = "_"

// JIT-friendly function with predictable patterns
function isVisible<T extends object>(
  meta: EntityMetadata<T>,
  propName: string,
  options: Parameters<typeof EntitySerializer.serialize>[1] & {
    preventCircularRef?: boolean
    populate?: string[] | boolean
  } = STATIC_OPTIONS_SHAPE
): boolean {
  // Fast path for boolean populate
  const populate = options.populate
  if (populate === true) {
    return true
  }

  if (Array.isArray(populate)) {
    // Check exclusions first (early exit)
    const exclude = options.exclude
    if (exclude && exclude.length > 0) {
      const excludeLen = exclude.length
      for (let i = 0; i < excludeLen; i++) {
        if (exclude[i] === propName) {
          return false
        }
      }
    }

    // Hoist computations outside loop
    const propNameLen = propName.length
    const propPrefix = propName + DOT
    const propPrefixLen = propPrefix.length
    const populateLen = populate.length

    // Simple loop that JIT can optimize well
    for (let i = 0; i < populateLen; i++) {
      const item = populate[i]
      if (item === propName || item === WILDCARD) {
        return true
      }
      if (
        item.length > propNameLen &&
        item.substring(0, propPrefixLen) === propPrefix
      ) {
        return true
      }
    }
    return false
  }

  // Inline property check for non-array case
  const prop = meta.properties[propName]
  const visible = (prop && !prop.hidden) || prop === undefined
  const prefixed = prop && !prop.primary && propName.charAt(0) === UNDERSCORE
  return visible && !prefixed
}

// Clean, JIT-friendly function
function isPopulated<T extends object>(
  entity: T,
  propName: string,
  options: Parameters<typeof EntitySerializer.serialize>[1] & {
    preventCircularRef?: boolean
    populate?: string[] | boolean
  } = STATIC_OPTIONS_SHAPE
): boolean {
  const populate = options.populate

  // Fast path for boolean
  if (typeof populate === "boolean") {
    return populate
  }

  if (!Array.isArray(populate)) {
    return false
  }

  // Hoist computations for JIT optimization
  const propNameLen = propName.length
  const propPrefix = propName + DOT
  const propPrefixLen = propPrefix.length
  const populateLen = populate.length

  // Simple predictable loop
  for (let i = 0; i < populateLen; i++) {
    const item = populate[i]
    if (item === propName || item === WILDCARD) {
      return true
    }
    if (
      item.length > propNameLen &&
      item.substring(0, propPrefixLen) === propPrefix
    ) {
      return true
    }
  }

  return false
}

/**
 * Custom property filtering for the serialization which takes into account circular references to not return them.
 * @param propName
 * @param meta
 * @param options
 * @param parents
 */
// @ts-ignore
function filterEntityPropToSerialize({
  propName,
  meta,
  options,
  parents,
}: {
  propName: string
  meta: EntityMetadata
  options: Parameters<typeof EntitySerializer.serialize>[1] & {
    preventCircularRef?: boolean
    populate?: string[] | boolean
  }
  parents?: string[]
}): boolean {
  const parentsArray = parents || EMPTY_ARRAY

  const isVisibleRes = isVisible(meta, propName, options)
  const prop = meta.properties[propName]

  if (
    prop &&
    options.preventCircularRef &&
    isVisibleRes &&
    prop.kind !== ReferenceKind.SCALAR
  ) {
    if (!!prop.mapToPk) {
      return true
    }

    const parentsLen = parentsArray.length
    for (let i = 0; i < parentsLen; i++) {
      if (parentsArray[i] === prop.type) {
        return false
      }
    }
    return true
  }

  return isVisibleRes
}

export class EntitySerializer {
  // Thread-safe per-instance cache to avoid concurrency issues
  private static readonly PROPERTY_CACHE_SIZE = 2000

  static serialize<T extends object, P extends string = never>(
    entity: T,
    options: Partial<typeof STATIC_OPTIONS_SHAPE> = STATIC_OPTIONS_SHAPE,
    parents: string[] = EMPTY_ARRAY
  ): EntityDTO<Loaded<T, P>> {
    // Avoid Array.from and Set allocation for hot path
    const parents_ = parents.length > 0 ? Array.from(new Set(parents)) : []

    const wrapped = helper(entity)
    const meta = wrapped.__meta
    let contextCreated = false

    if (!wrapped.__serializationContext.root) {
      const root = new SerializationContext<T>({} as any)
      SerializationContext.propagate(
        root,
        entity,
        (meta, prop) => meta.properties[prop]?.kind !== ReferenceKind.SCALAR
      )
      contextCreated = true
    }

    const root = wrapped.__serializationContext
      .root! as SerializationContext<any> & {
      visitedSerialized?: Map<string, any>
    }

    const ret = {} as EntityDTO<Loaded<T, P>>

    // Use Set for deduplication but keep it simple
    const keys = new Set<string>()

    const primaryKeys = meta.primaryKeys
    const primaryKeysLen = primaryKeys.length
    for (let i = 0; i < primaryKeysLen; i++) {
      keys.add(primaryKeys[i])
    }

    const entityKeys = Object.keys(entity)
    const entityKeysLen = entityKeys.length
    for (let i = 0; i < entityKeysLen; i++) {
      keys.add(entityKeys[i])
    }

    const visited = root.visited.has(entity)
    if (!visited) {
      root.visited.add(entity)
    }

    const keysArray = Array.from(keys)
    const keysLen = keysArray.length

    // Hoist invariant calculations
    const className = meta.className
    const platform = wrapped.__platform
    const skipNull = options.skipNull
    const metaProperties = meta.properties
    const preventCircularRef = options.preventCircularRef

    // Clean property processing loop
    for (let i = 0; i < keysLen; i++) {
      const prop = keysArray[i]

      // Simple filtering logic
      const isVisibleRes = isVisible(meta, prop, options)
      const propMeta = metaProperties[prop]

      let shouldSerialize = isVisibleRes
      if (
        propMeta &&
        preventCircularRef &&
        isVisibleRes &&
        propMeta.kind !== ReferenceKind.SCALAR
      ) {
        if (!!propMeta.mapToPk) {
          shouldSerialize = true
        } else {
          const parentsLen = parents_.length
          for (let j = 0; j < parentsLen; j++) {
            if (parents_[j] === propMeta.type) {
              shouldSerialize = false
              break
            }
          }
        }
      }

      if (!shouldSerialize) {
        continue
      }

      const cycle = root.visit(className, prop)
      if (cycle && visited) continue

      const val = this.processProperty<T>(
        prop as keyof T & string,
        entity,
        options,
        parents_
      )

      if (!cycle) {
        root.leave(className, prop)
      }

      if (skipNull && Utils.isPlainObject(val)) {
        Utils.dropUndefinedProperties(val, null)
      }

      if (typeof val !== "undefined" && !(val === null && skipNull)) {
        ret[this.propertyName(meta, prop as keyof T & string, platform)] =
          val as T[keyof T & string]
      }
    }

    if (contextCreated) {
      root.close()
    }

    if (!wrapped.isInitialized()) {
      return ret
    }

    // Clean getter processing
    const metaProps = meta.props
    const metaPropsLen = metaProps.length

    for (let i = 0; i < metaPropsLen; i++) {
      const prop = metaProps[i]
      const propName = prop.name

      // Clear, readable conditions
      if (
        prop.getter &&
        prop.getterName === undefined &&
        typeof entity[propName] !== "undefined" &&
        isVisible(meta, propName, options)
      ) {
        ret[this.propertyName(meta, propName, platform)] = this.processProperty(
          propName,
          entity,
          options,
          parents_
        )
      } else if (
        prop.getterName &&
        (entity[prop.getterName] as unknown) instanceof Function &&
        isVisible(meta, propName, options)
      ) {
        ret[this.propertyName(meta, propName, platform)] = this.processProperty(
          prop.getterName as keyof T & string,
          entity,
          options,
          parents_
        )
      }
    }

    return ret
  }

  // Thread-safe property name resolution with WeakMap for per-entity caching
  private static propertyNameCache = new WeakMap<
    EntityMetadata<any>,
    Map<string, string>
  >()

  private static propertyName<T>(
    meta: EntityMetadata<T>,
    prop: string,
    platform?: Platform
  ): string {
    // Use WeakMap per metadata to avoid global cache conflicts
    let entityCache = this.propertyNameCache.get(meta)
    if (!entityCache) {
      entityCache = new Map<string, string>()
      this.propertyNameCache.set(meta, entityCache)
    }

    const cacheKey = `${prop}:${platform?.constructor.name || "no-platform"}`

    const cached = entityCache.get(cacheKey)
    if (cached !== undefined) {
      return cached
    }

    // Inline property resolution for hot path
    let result: string
    const property = meta.properties[prop]

    /* istanbul ignore next */
    if (property?.serializedName) {
      result = property.serializedName as string
    } else if (property?.primary && platform) {
      result = platform.getSerializedPrimaryKeyField(prop) as string
    } else {
      result = prop
    }

    // Prevent cache from growing too large
    if (entityCache.size >= this.PROPERTY_CACHE_SIZE) {
      entityCache.clear() // Much faster than selective deletion
    }

    entityCache.set(cacheKey, result)
    return result
  }

  private static processProperty<T extends object>(
    prop: string,
    entity: T,
    options: Parameters<typeof EntitySerializer.serialize>[1] & {
      preventCircularRef?: boolean
      populate?: string[] | boolean
    },
    parents: string[] = EMPTY_ARRAY
  ): T[keyof T] | undefined {
    // Avoid array allocation when not needed
    const parents_ =
      parents.length > 0
        ? [...parents, entity.constructor.name]
        : [entity.constructor.name]

    // Handle dotted properties efficiently
    const parts = prop.split(DOT)
    prop = parts[0] as string & keyof T

    const wrapped = helper(entity)
    const property = wrapped.__meta.properties[prop]
    const serializer = property?.serializer
    const propValue = entity[prop]

    // Fast path for function properties
    if ((propValue as unknown) instanceof Function) {
      const returnValue = (propValue as unknown as () => T[keyof T & string])()
      if (!options.ignoreSerializers && serializer) {
        return serializer(returnValue)
      }
      return returnValue
    }

    /* istanbul ignore next */
    if (!options.ignoreSerializers && serializer) {
      return serializer(propValue)
    }

    // Type checks in optimal order
    if (Utils.isCollection(propValue)) {
      return this.processCollection(
        prop as keyof T & string,
        entity,
        options,
        parents_
      )
    }

    if (Utils.isEntity(propValue, true)) {
      return this.processEntity(
        prop as keyof T & string,
        entity,
        wrapped.__platform,
        options,
        parents_
      )
    }

    /* istanbul ignore next */
    if (property?.reference === ReferenceKind.EMBEDDED) {
      if (Array.isArray(propValue)) {
        return (propValue as object[]).map((item) =>
          helper(item).toJSON()
        ) as T[keyof T]
      }

      if (Utils.isObject(propValue)) {
        return helper(propValue).toJSON() as T[keyof T]
      }
    }

    const customType = property?.customType
    if (customType) {
      return customType.toJSON(propValue, wrapped.__platform)
    }
    return wrapped.__platform.normalizePrimaryKey(
      propValue as unknown as IPrimaryKey
    ) as unknown as T[keyof T]
  }

  private static extractChildOptions<T extends object>(
    options: Parameters<typeof EntitySerializer.serialize>[1] & {
      preventCircularRef?: boolean
      populate?: string[] | boolean
    },
    prop: keyof T & string
  ): Parameters<typeof EntitySerializer.serialize>[1] & {
    preventCircularRef?: boolean
    populate?: string[] | boolean
  } {
    const propPrefix = prop + DOT
    const propPrefixLen = propPrefix.length

    // Inline function to avoid call overhead
    const extractChildElements = (items: string[]) => {
      const result: string[] = []
      const itemsLen = items.length

      // Traditional for loop for better performance
      for (let i = 0; i < itemsLen; i++) {
        const field = items[i]
        if (
          field.length > propPrefixLen &&
          field.substring(0, propPrefixLen) === propPrefix
        ) {
          result.push(field.substring(propPrefixLen))
        }
      }
      return result
    }

    const populate = options.populate
    const exclude = options.exclude

    // Avoid object spread when possible
    const result = {
      populate:
        Array.isArray(populate) && !populate.includes(WILDCARD)
          ? extractChildElements(populate as unknown as string[])
          : populate,
      exclude:
        Array.isArray(exclude) && !exclude.includes(WILDCARD)
          ? extractChildElements(exclude)
          : exclude,
      preventCircularRef: options.preventCircularRef,
      skipNull: options.skipNull,
      ignoreSerializers: options.ignoreSerializers,
      forceObject: options.forceObject,
    } as Parameters<typeof EntitySerializer.serialize>[1] & {
      preventCircularRef?: boolean
      populate?: string[] | boolean
    }

    return result
  }

  private static processEntity<T extends object>(
    prop: keyof T & string,
    entity: T,
    platform: Platform,
    options: Parameters<typeof EntitySerializer.serialize>[1] & {
      preventCircularRef?: boolean
      populate?: string[] | boolean
    },
    parents: string[] = EMPTY_ARRAY
  ): T[keyof T] | undefined {
    const parents_ =
      parents.length > 0
        ? [...parents, entity.constructor.name]
        : [entity.constructor.name]

    const child = Reference.unwrapReference(entity[prop] as T)
    const wrapped = helper(child)
    // Fixed: was incorrectly calling isPopulated(child, prop, options) instead of isPopulated(entity, prop, options)
    const populated =
      isPopulated(entity, prop, options) && wrapped.isInitialized()
    const expand = populated || options.forceObject || !wrapped.__managed

    if (expand) {
      return this.serialize(
        child,
        this.extractChildOptions(options, prop),
        parents_
      ) as T[keyof T]
    }

    return platform.normalizePrimaryKey(
      wrapped.getPrimaryKey() as IPrimaryKey
    ) as T[keyof T]
  }

  private static processCollection<T extends object>(
    prop: keyof T & string,
    entity: T,
    options: Parameters<typeof EntitySerializer.serialize>[1] & {
      preventCircularRef?: boolean
      populate?: string[] | boolean
    },
    parents: string[] = EMPTY_ARRAY
  ): T[keyof T] | undefined {
    const parents_ =
      parents.length > 0
        ? [...parents, entity.constructor.name]
        : [entity.constructor.name]
    const col = entity[prop] as unknown as Collection<T>

    if (!col.isInitialized()) {
      return undefined
    }

    const items = col.getItems(false)
    const itemsLen = items.length
    const result = new Array(itemsLen)

    const childOptions = this.extractChildOptions(options, prop)

    // Check if the collection property itself should be populated
    // Fixed: was incorrectly calling isPopulated(item, prop, options) instead of isPopulated(entity, prop, options)
    const shouldPopulateCollection = isPopulated(entity, prop, options)

    for (let i = 0; i < itemsLen; i++) {
      const item = items[i]
      if (shouldPopulateCollection) {
        result[i] = this.serialize(item, childOptions, parents_)
      } else {
        result[i] = helper(item).getPrimaryKey()
      }
    }

    return result as unknown as T[keyof T]
  }
}

export const mikroOrmSerializer = <TOutput extends object>(
  data: any,
  options?: Partial<
    Parameters<typeof EntitySerializer.serialize>[1] & {
      preventCircularRef: boolean | undefined
      populate: string[] | boolean | undefined
    }
  >
): Promise<TOutput> => {
  return new Promise<TOutput>((resolve) => {
    // Efficient options handling
    if (!options) {
      options = STATIC_OPTIONS_SHAPE
    } else {
      // Check if we can use static shape
      let useStatic = true
      const optionKeys = Object.keys(options)
      for (let i = 0; i < optionKeys.length; i++) {
        const key = optionKeys[i] as keyof typeof options
        if (
          options[key] !==
          STATIC_OPTIONS_SHAPE[key as keyof typeof STATIC_OPTIONS_SHAPE]
        ) {
          useStatic = false
          break
        }
      }

      if (useStatic) {
        options = STATIC_OPTIONS_SHAPE
      } else {
        options = { ...STATIC_OPTIONS_SHAPE, ...options }
      }
    }

    const data_ = (Array.isArray(data) ? data : [data]).filter(Boolean)

    const forSerialization: object[] = []
    const notForSerialization: object[] = []

    // Simple classification loop
    const dataLen = data_.length
    for (let i = 0; i < dataLen; i++) {
      const object = data_[i]
      if (object.__meta) {
        forSerialization.push(object)
      } else {
        notForSerialization.push(object)
      }
    }

    // Pre-allocate result array
    const forSerializationLen = forSerialization.length
    const result: any = new Array(forSerializationLen)

    for (let i = 0; i < forSerializationLen; i++) {
      result[i] = EntitySerializer.serialize(forSerialization[i], options)
    }

    // Simple result construction
    let finalResult: any
    if (notForSerialization.length > 0) {
      finalResult = result.concat(notForSerialization)
    } else {
      finalResult = result
    }

    resolve(Array.isArray(data) ? finalResult : finalResult[0])
  })
}
