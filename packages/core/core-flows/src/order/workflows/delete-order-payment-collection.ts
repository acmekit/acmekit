import type { PaymentCollectionDTO } from "@acmekit/framework/types"
import {
  AcmeKitError,
  Modules,
  PaymentCollectionStatus,
} from "@acmekit/framework/utils"
import {
  createStep,
  createWorkflow,
  WorkflowData,
} from "@acmekit/framework/workflows-sdk"
import { removeRemoteLinkStep, useQueryGraphStep } from "../../common"

/**
 * This step validates that the order doesn't have an active payment collection.
 */
export const throwUnlessStatusIsNotPaid = createStep(
  "validate-payment-collection",
  ({ paymentCollection }: { paymentCollection: PaymentCollectionDTO }) => {
    if (paymentCollection.status !== PaymentCollectionStatus.NOT_PAID) {
      throw new AcmeKitError(
        AcmeKitError.Types.NOT_ALLOWED,
        `Can only delete payment collections where status is not_paid`
      )
    }
  }
)

/**
 * The details of the payment collection to delete.
 */
export type DeleteOrderPaymentCollectionsInput = {
  /**
   * The ID of the payment collection to delete.
   */
  id: string
}

export const deleteOrderPaymentCollectionsId =
  "delete-order-payment-collectionworkflow"
/**
 * This workflow deletes one or more payment collections of an order. It's used by the
 * [Delete Payment Collection API Route](https://docs.acmekit.com/api/admin#payment-collections_deletepaymentcollectionsid).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * deleting a payment collection of an order.
 *
 * @example
 * const { result } = await deleteOrderPaymentCollections(container)
 * .run({
 *   input: {
 *     id: "order_123"
 *   }
 * })
 *
 * @summary
 *
 * Delete a payment collection of an order.
 */
export const deleteOrderPaymentCollections = createWorkflow(
  deleteOrderPaymentCollectionsId,
  (
    input: WorkflowData<DeleteOrderPaymentCollectionsInput>
  ): WorkflowData<void> => {
    const { data: paymentCollection } = useQueryGraphStep({
      entity: "payment_collection",
      filters: { id: input.id },
      fields: ["id", "status"],
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "payment-collection-query" })

    throwUnlessStatusIsNotPaid({ paymentCollection })

    removeRemoteLinkStep({
      [Modules.PAYMENT]: { payment_collection_id: input.id },
    })
  }
)
