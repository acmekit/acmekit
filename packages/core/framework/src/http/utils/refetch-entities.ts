import type {
  GraphResultSet,
  MedusaContainer,
  RemoteJoinerOptions,
  RemoteQueryEntryPoints,
  RemoteQueryFunctionReturnPagination,
} from "../../types"
import { ContainerRegistrationKeys, isString } from "../../utils"
import type { MedusaRequest } from "../types"

export const refetchEntities = async <TEntry extends string>({
  entity,
  idOrFilter,
  scope,
  fields,
  pagination,
  withDeleted,
  options,
}: {
  entity: TEntry
  idOrFilter?: string | object
  scope: MedusaContainer
  fields?: string[]
  pagination?: MedusaRequest["queryConfig"]["pagination"]
  withDeleted?: boolean
  options?: RemoteJoinerOptions
}): Promise<
  Omit<GraphResultSet<TEntry>, "metadata"> & {
    metadata: RemoteQueryFunctionReturnPagination
  }
> => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  let filters = isString(idOrFilter) ? { id: idOrFilter } : idOrFilter
  let context!: Record<string, unknown>

  if (filters && "context" in filters) {
    const { context: context_, ...rest } = filters
    if (context_) {
      context = context_! as Record<string, unknown>
    }
    filters = rest
  }

  const graphOptions: Parameters<typeof query.graph>[0] = {
    entity,
    fields: fields ?? [],
    filters,
    pagination,
    withDeleted,
    context: context,
  }

  const result = await query.graph(graphOptions, options)
  return {
    data: result.data as TEntry extends keyof RemoteQueryEntryPoints
      ? RemoteQueryEntryPoints[TEntry][]
      : any[],
    metadata: result.metadata ?? ({} as RemoteQueryFunctionReturnPagination),
  }
}

export const refetchEntity = async <TEntry extends string>({
  entity,
  idOrFilter,
  scope,
  fields,
  options,
}: {
  entity: TEntry & string
  idOrFilter: string | object
  scope: MedusaContainer
  fields: string[]
  options?: RemoteJoinerOptions
}): Promise<
  TEntry extends keyof RemoteQueryEntryPoints
    ? RemoteQueryEntryPoints[TEntry]
    : any
> => {
  const { data } = await refetchEntities<TEntry>({
    entity,
    idOrFilter,
    scope,
    fields,
    options,
  })

  return Array.isArray(data) ? data[0] : data
}
