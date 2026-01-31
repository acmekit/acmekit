import {
  BatchMethodResponse,
  AcmeKitContainer,
  ShippingOptionRuleDTO,
} from "@acmekit/framework/types"
import {
  ContainerRegistrationKeys,
  promiseAll,
} from "@acmekit/framework/utils"

export const refetchShippingOption = async (
  shippingOptionId: string,
  scope: AcmeKitContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "shipping_option",
    filters: { id: shippingOptionId },
    fields: fields,
  })

  return data[0]
}

export const refetchBatchRules = async (
  batchResult: BatchMethodResponse<ShippingOptionRuleDTO>,
  scope: AcmeKitContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  let created = Promise.resolve<ShippingOptionRuleDTO[]>([])
  let updated = Promise.resolve<ShippingOptionRuleDTO[]>([])

  if (batchResult.created.length) {
    created = query
      .graph({
        entity: "shipping_option_rule",
        filters: { id: batchResult.created.map((p) => p.id) },
        fields: fields,
      })
      .then(({ data }) => data)
  }

  if (batchResult.updated.length) {
    updated = query
      .graph({
        entity: "shipping_option_rule",
        filters: { id: batchResult.updated.map((p) => p.id) },
        fields: fields,
      })
      .then(({ data }) => data)
  }

  const [createdRes, updatedRes] = await promiseAll([created, updated])
  return {
    created: createdRes,
    updated: updatedRes,
    deleted: {
      ids: batchResult.deleted,
      object: "shipping_option_rule",
      deleted: true,
    },
  }
}
