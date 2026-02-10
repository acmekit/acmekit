import { HttpTypes } from "@acmekit/types"
import { useQueryParams } from "../../../../../hooks/use-query-params"

export const useWorkflowExecutionTableQuery = ({
  pageSize = 20,
  prefix,
}: {
  pageSize?: number
  prefix?: string
}) => {
  const raw = useQueryParams(
    ["q", "offset", "order", "state", "created_at", "updated_at"],
    prefix
  )

  const { offset, order, state, created_at, updated_at, ...rest } = raw

  const searchParams: HttpTypes.AdminGetWorkflowExecutionsParams = {
    limit: pageSize,
    offset: offset ? parseInt(offset) : 0,
    order: order ?? "-created_at",
    state: state ? state.split(",") : undefined,
    created_at: created_at ? JSON.parse(created_at) : undefined,
    updated_at: updated_at ? JSON.parse(updated_at) : undefined,
    ...rest,
  }

  return {
    searchParams,
    raw,
  }
}
