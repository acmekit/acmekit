import { LocalWorkflow } from "@acmekit/orchestration"
import { LoadedModule, AcmeKitContainer } from "@acmekit/types"
import { ExportedWorkflow } from "./helper"

class AcmeKitWorkflow {
  static workflows: Record<
    string,
    (
      container?: LoadedModule[] | AcmeKitContainer
    ) => Omit<
      LocalWorkflow,
      "run" | "registerStepSuccess" | "registerStepFailure" | "cancel"
    > &
      ExportedWorkflow
  > = {}

  static registerWorkflow(workflowId, exportedWorkflow) {
    if (workflowId in AcmeKitWorkflow.workflows) {
      return
    }

    AcmeKitWorkflow.workflows[workflowId] = exportedWorkflow
  }

  static unregisterWorkflow(workflowId) {
    delete AcmeKitWorkflow.workflows[workflowId]
  }

  static getWorkflow(workflowId): ExportedWorkflow {
    return AcmeKitWorkflow.workflows[workflowId] as unknown as ExportedWorkflow
  }
}

global.AcmeKitWorkflow ??= AcmeKitWorkflow
const GlobalAcmeKitWorkflow = global.AcmeKitWorkflow

export { GlobalAcmeKitWorkflow as AcmeKitWorkflow }
