import { Badge, Container, Copy, Heading, StatusBadge, Text, clx } from "@acmekit/ui"
import { useTranslation } from "react-i18next"
import { getTransactionState, getTransactionStateColor } from "../../../utils"
import { HttpTypes } from "@acmekit/types"
import { TransactionState, TransactionStepState } from "../../../types"
import { useDate } from "../../../../../hooks/use-date"
import { STEP_ERROR_STATES, STEP_SKIPPED_STATES } from "../../../constants"

type WorkflowExecutionGeneralSectionProps = {
  execution: HttpTypes.AdminWorkflowExecution
}

export const WorkflowExecutionGeneralSection = ({
  execution,
}: WorkflowExecutionGeneralSectionProps) => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()

  const cleanId = execution.id.replace("wf_exec_", "")
  const translatedState = getTransactionState(
    t,
    execution.state as TransactionState
  )
  const stateColor = getTransactionStateColor(
    execution.state as TransactionState
  )

  const createdAt = execution.created_at
  const updatedAt = execution.updated_at

  const allSteps = Object.values(execution.execution?.steps || {}).filter(
    (step) => step.id !== ROOT_PREFIX
  )

  const totalSteps = allSteps.length
  const completedSteps = allSteps.filter(
    (step) => step.invoke.state === TransactionStepState.DONE
  ).length
  const failedSteps = allSteps.filter((step) =>
    STEP_ERROR_STATES.includes(step.invoke.state as HttpTypes.TransactionStepState)
  ).length
  const skippedSteps = allSteps.filter((step) =>
    STEP_SKIPPED_STATES.includes(step.invoke.state as HttpTypes.TransactionStepState)
  ).length
  const compensatedSteps = allSteps.filter(
    (step) => step.compensate.state === TransactionStepState.REVERTED
  ).length

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-x-0.5">
          <Heading>{cleanId}</Heading>
          <Copy content={cleanId} className="text-ui-fg-muted" />
        </div>
        <StatusBadge color={stateColor}>{translatedState}</StatusBadge>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("workflowExecutions.workflowIdLabel")}
        </Text>
        <div className="flex items-center gap-x-1">
          <Badge size="2xsmall" className="w-fit">
            {execution.workflow_id}
          </Badge>
          <Copy content={execution.workflow_id} className="text-ui-fg-muted" />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("workflowExecutions.transactionIdLabel")}
        </Text>
        <div className="flex items-center gap-x-1">
          <Badge size="2xsmall" className="w-fit">
            {execution.transaction_id}
          </Badge>
          <Copy
            content={execution.transaction_id}
            className="text-ui-fg-muted"
          />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("workflowExecutions.progressLabel")}
        </Text>
        <Progress steps={execution.execution?.steps} />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.summary")}
        </Text>
        <div className="flex flex-col gap-y-1">
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {t("workflowExecutions.metrics.stepsSummary", {
              completed: completedSteps,
              total: totalSteps,
            })}
          </Text>
          {failedSteps > 0 && (
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {t("workflowExecutions.metrics.failedSteps", {
                count: failedSteps,
              })}
            </Text>
          )}
          {skippedSteps > 0 && (
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {t("workflowExecutions.metrics.skippedSteps", {
                count: skippedSteps,
              })}
            </Text>
          )}
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {compensatedSteps > 0
              ? t("workflowExecutions.metrics.compensatedYes")
              : t("workflowExecutions.metrics.compensatedNo")}
          </Text>
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.createdAt")}
        </Text>
        <Text size="small" leading="compact">
          {createdAt
            ? getFullDate({ date: createdAt, includeTime: true })
            : "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.updatedAt")}
        </Text>
        <Text size="small" leading="compact">
          {updatedAt
            ? getFullDate({ date: updatedAt, includeTime: true })
            : "-"}
        </Text>
      </div>
    </Container>
  )
}

const ROOT_PREFIX = "_root"

const Progress = ({
  steps,
}: {
  steps?: Record<string, HttpTypes.AdminWorkflowExecutionStep> | null
}) => {
  const { t } = useTranslation()

  if (!steps) {
    return (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {t("workflowExecutions.stepsCompletedLabel", {
          completed: 0,
          count: 0,
        })}
      </Text>
    )
  }

  const actionableSteps = Object.values(steps).filter(
    (step) => step.id !== ROOT_PREFIX
  )

  const completedSteps = actionableSteps.filter(
    (step) => step.invoke.state === TransactionStepState.DONE
  )

  return (
    <div className="flex w-fit items-center gap-x-2">
      <div className="flex items-center gap-x-[3px]">
        {actionableSteps.map((step) => (
          <div
            key={step.id}
            className={clx(
              "bg-ui-bg-switch-off shadow-details-switch-background h-3 w-1.5 rounded-full",
              {
                "bg-ui-fg-muted":
                  step.invoke.state === TransactionStepState.DONE,
              }
            )}
          />
        ))}
      </div>
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {t("workflowExecutions.stepsCompletedLabel", {
          completed: completedSteps.length,
          count: actionableSteps.length,
        })}
      </Text>
    </div>
  )
}
