import { updateStoresWorkflow } from "@acmekit/core-flows"
import {
  ContainerRegistrationKeys,
  AcmeKitError,
  remoteQueryObjectFromString,
} from "@acmekit/framework/utils"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { AdminGetStoreParamsType } from "../validators"
import { refetchStore } from "../helpers"
import { HttpTypes } from "@acmekit/framework/types"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<AdminGetStoreParamsType>,
  res: AcmeKitResponse<HttpTypes.AdminStoreResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "store",
    variables,
    fields: req.queryConfig.fields,
  })

  const [store] = await remoteQuery(queryObject)
  res.status(200).json({ store })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    HttpTypes.AdminUpdateStore,
    HttpTypes.AdminStoreParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminStoreResponse>
) => {
  const existingStore = await refetchStore(req.params.id, req.scope, ["id"])
  if (!existingStore) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Store with id "${req.params.id}" not found`
    )
  }

  const { result } = await updateStoresWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody,
    },
  })

  const store = await refetchStore(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ store })
}
