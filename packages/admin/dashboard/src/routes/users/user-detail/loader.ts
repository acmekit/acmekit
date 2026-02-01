import { LoaderFunctionArgs } from "react-router-dom"

import { usersQueryKeys } from "../../../hooks/api/users"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const userDetailQuery = (id: string) => ({
  queryKey: usersQueryKeys.detail(id),
  queryFn: async () => sdk.admin.user.retrieve(id),
})

export const userLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = userDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
