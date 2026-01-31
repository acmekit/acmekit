import {
  deleteCollectionsWorkflow,
  updateCollectionsWorkflow,
} from "@acmekit/core-flows"
import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

import { AdditionalData, HttpTypes } from "@acmekit/framework/types"
import { AcmeKitError } from "@acmekit/framework/utils"
import { refetchCollection } from "../helpers"
import { AdminUpdateCollectionType } from "../validators"

export const GET = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminCollectionParams>,
  res: AcmeKitResponse<HttpTypes.AdminCollectionResponse>
) => {
  const collection = await refetchCollection(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ collection })
}

export const POST = async (
  req: AuthenticatedAcmeKitRequest<
    AdminUpdateCollectionType & AdditionalData,
    HttpTypes.AdminCollectionParams
  >,
  res: AcmeKitResponse<HttpTypes.AdminCollectionResponse>
) => {
  const existingCollection = await refetchCollection(req.params.id, req.scope, [
    "id",
  ])
  if (!existingCollection) {
    throw new AcmeKitError(
      AcmeKitError.Types.NOT_FOUND,
      `Collection with id "${req.params.id}" not found`
    )
  }

  const { additional_data, ...rest } = req.validatedBody

  await updateCollectionsWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: rest,
      additional_data,
    },
  })

  const collection = await refetchCollection(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ collection })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse<HttpTypes.AdminCollectionDeleteResponse>
) => {
  const id = req.params.id

  await deleteCollectionsWorkflow(req.scope).run({
    input: { ids: [id] },
  })

  res.status(200).json({
    id,
    object: "collection",
    deleted: true,
  })
}
