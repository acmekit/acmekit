import { useTranslation } from "react-i18next"
import type { Filter } from "../../../../../components/table/data-table"

/**
 * Filters for the workflow executions list table.
 *
 * This follows the same pattern as other legacy DataTable filter hooks
 * (for example: useOrderTableFilters, useApiKeyManagementTableFilters).
 */
export const useWorkflowExecutionTableFilters = (): Filter[] => {
  const { t } = useTranslation()

  const stateFilter: Filter = {
    key: "state",
    label: t("fields.status"),
    type: "select",
    multiple: true,
    options: [
      {
        label: t("workflowExecutions.state.done"),
        value: "done",
      },
      {
        label: t("workflowExecutions.state.failed"),
        value: "failed",
      },
      {
        label: t("workflowExecutions.state.reverted"),
        value: "reverted",
      },
      {
        label: t("workflowExecutions.state.invoking"),
        value: "invoking",
      },
      {
        label: t("workflowExecutions.transaction.state.waitingToCompensate"),
        value: "waiting_to_compensate",
      },
      {
        label: t("workflowExecutions.state.compensating"),
        value: "compensating",
      },
      {
        label: t("workflowExecutions.state.notStarted"),
        value: "not_started",
      },
    ],
  }

  const dateFilters: Filter[] = [
    { key: "created_at", label: t("fields.createdAt"), type: "date" },
    { key: "updated_at", label: t("fields.updatedAt"), type: "date" },
  ]

  return [stateFilter, ...dateFilters]
}

