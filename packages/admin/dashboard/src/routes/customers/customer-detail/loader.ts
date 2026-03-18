import { LoaderFunctionArgs } from "react-router-dom"
import { customersQueryKeys } from "../../../hooks/api/customers"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const customerDetailQuery = (id: string) => ({
  queryKey: customersQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.customer.retrieve(id, {
      fields: "+*addresses",
    }),
})

export const customerLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = customerDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}
