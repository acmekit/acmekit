import { ColumnAdapter } from "../../hooks/table/columns/use-configurable-table-columns"

export const entityAdapters = {} as const

export type EntityType = keyof typeof entityAdapters

export function getEntityAdapter<TData = any>(
  _entity: string
): ColumnAdapter<TData> | undefined {
  return undefined
}
