import { z } from "@acmekit/framework/zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export type StoreReturnReasonParamsType = z.infer<
  typeof StoreReturnReasonParams
>
export const StoreReturnReasonParams = createSelectParams()

export type StoreReturnReasonsParamsType = z.infer<
  typeof StoreReturnReasonsParams
>
export const StoreReturnReasonsParams = createFindParams()
