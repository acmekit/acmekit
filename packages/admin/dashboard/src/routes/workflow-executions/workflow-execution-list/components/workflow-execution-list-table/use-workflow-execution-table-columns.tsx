import { Badge, Copy, Text, clx } from "@acmekit/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DateCell } from "../../../../../components/table/table-cells/common/date-cell/date-cell"
import { TransactionStepState } from "../../../types"
import { getTransactionState, getTransactionStateColor } from "../../../utils"
import { HttpTypes } from "@acmekit/types"
import { DataTableStatusCell } from "../../../../../components/data-table/components/data-table-status-cell/data-table-status-cell"

const columnHelper =
  createColumnHelper<
    HttpTypes.AdminWorkflowExecutionResponse["workflow_execution"]
  >()

export const useWorkflowExecutionTableColumns = (): ColumnDef<
  HttpTypes.AdminWorkflowExecutionResponse["workflow_execution"],
  any
>[] => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("workflow_id", {
        header: t("workflowExecutions.workflowIdLabel"),
        cell: ({ getValue }) => {
          const workflowId = getValue()

          return (
            <div className="flex items-center gap-x-1">
              <Badge size="2xsmall" className="truncate">
                {workflowId}
              </Badge>
              <Copy content={workflowId} className="text-ui-fg-muted" />
            </div>
          )
        },
      }),
      columnHelper.accessor("state", {
        header: t("fields.state"),
        cell: ({ getValue }) => {
          const state = getValue()

          const color = getTransactionStateColor(state)
          const translatedState = getTransactionState(t, state)

          return (
            <DataTableStatusCell color={color}>
              <span className="capitalize">{translatedState}</span>
            </DataTableStatusCell>
          )
        },
      }),
      columnHelper.accessor("execution", {
        header: t("workflowExecutions.progressLabel"),
        cell: ({ getValue }) => {
          const steps = getValue()?.steps as
            | Record<string, HttpTypes.AdminWorkflowExecutionStep>
            | undefined

          if (!steps) {
            return (
              <span className="text-ui-fg-subtle whitespace-nowrap">
                {t("workflowExecutions.stepsCompletedLabel", {
                  completed: 0,
                  count: 0,
                })}
              </span>
            )
          }

          const actionableSteps = Object.values(steps).filter(
            (step) => step.id !== ROOT_PREFIX
          )

          const completedSteps = actionableSteps.filter(
            (step) => step.invoke.state === TransactionStepState.DONE
          )

          return (
            <div className="flex items-center gap-x-2">
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
                    data-completed={
                      step.invoke.state === TransactionStepState.DONE
                    }
                  />
                ))}
              </div>
              <span className="text-ui-fg-subtle whitespace-nowrap">
                {t("workflowExecutions.stepsCompletedLabel", {
                  completed: completedSteps.length,
                  count: actionableSteps.length,
                })}
              </span>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "duration",
        header: t("fields.duration"),
        cell: ({ row }) => {
          const createdAt = row.original.created_at as Date | string | undefined
          const updatedAt = row.original.updated_at as Date | string | undefined
          const state = row.original.state as HttpTypes.TransactionState

          if (!createdAt) {
            return (
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                {"-"}
              </Text>
            )
          }

          const start = new Date(createdAt)
          const end =
            updatedAt &&
            ["done", "failed", "reverted"].includes(state as string)
              ? new Date(updatedAt)
              : new Date()

          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return (
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                {"-"}
              </Text>
            )
          }

          const ms = end.getTime() - start.getTime()

          if (ms < 0) {
            return (
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                {"-"}
              </Text>
            )
          }

          const seconds = Math.floor(ms / 1000)
          const minutes = Math.floor(seconds / 60)
          const hours = Math.floor(minutes / 60)

          let label: string

          if (hours > 0) {
            label = `${hours}h ${minutes % 60}m`
          } else if (minutes > 0) {
            label = `${minutes}m ${seconds % 60}s`
          } else if (seconds > 0) {
            label = `${seconds}s`
          } else if (ms > 0) {
            label = "<1s"
          } else {
            label = "0s"
          }

          return (
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {label}
            </Text>
          )
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.createdAt"),
        cell: ({ getValue }) => {
          const date = getValue()
          return <DateCell date={date} />
        },
      }),
      columnHelper.accessor("updated_at", {
        header: t("fields.updatedAt"),
        cell: ({ getValue }) => {
          const date = getValue()
          return <DateCell date={date} />
        },
      }),
    ],
    [t]
  )
}

const ROOT_PREFIX = "_root"
