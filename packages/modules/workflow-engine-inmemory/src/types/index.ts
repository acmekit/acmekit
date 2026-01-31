import { ContainerLike } from "@acmekit/framework"
import { Logger } from "@acmekit/framework/types"
import { FlowCancelOptions } from "@acmekit/framework/workflows-sdk"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export type WorkflowOrchestratorCancelOptions = Omit<
  FlowCancelOptions,
  "transaction" | "transactionId" | "container"
> & {
  transactionId: string
  container?: ContainerLike
}
