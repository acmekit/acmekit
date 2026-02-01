import React from "react"
import { Badge, StatusBadge } from "@acmekit/ui"
import { HttpTypes } from "@acmekit/types"
import { DateCell } from "../../components/table/table-cells/common/date-cell"
import { MoneyAmountCell } from "../../components/table/table-cells/common/money-amount-cell"
import { TFunction } from "i18next"

export type CellRenderer<TData = any> = (
  value: any,
  row: TData,
  column: HttpTypes.AdminColumn,
  t: TFunction
) => React.ReactNode

export type RendererRegistry = Map<string, CellRenderer>

const cellRenderers: RendererRegistry = new Map()

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

const TextRenderer: CellRenderer = (value, _row, _column, _t) => {
  if (value === null || value === undefined) return "-"
  return String(value)
}

const CountRenderer: CellRenderer = (value, _row, _column, t) => {
  const items = value || []
  const count = Array.isArray(items) ? items.length : 0
  return t("general.items", { count })
}

const StatusRenderer: CellRenderer = (value, _row, _column, t) => {
  if (!value) return "-"

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "published":
        return "green"
      case "pending":
      case "processing":
        return "orange"
      case "draft":
        return "grey"
      case "rejected":
      case "failed":
      case "canceled":
        return "red"
      default:
        return "grey"
    }
  }

  const getTranslatedStatus = (status: string): string => {
    if (!t) return status
    const lowerStatus = status.toLowerCase()
    return t(`status.${lowerStatus}`, status) as string
  }

  const translatedValue = getTranslatedStatus(value)
  return (
    <StatusBadge color={getStatusColor(value)}>{translatedValue}</StatusBadge>
  )
}

const BadgeListRenderer: CellRenderer = (value, _row, _column, t) => {
  if (!Array.isArray(value)) return "-"

  const items = value.slice(0, 2)
  const remaining = value.length - 2

  return (
    <div className="flex gap-1">
      {items.map((item, index) => (
        <Badge key={index} size="xsmall">
          {typeof item === "string" ? item : item.name || item.title || "-"}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge size="xsmall" color="grey">
          {t
            ? t("general.plusCountMore", "+ {{count}} more", {
                count: remaining,
              })
            : `+${remaining}`}
        </Badge>
      )}
    </div>
  )
}

const DateRenderer: CellRenderer = (value, _row, _column, _t) => {
  return <DateCell date={value} />
}

const CurrencyRenderer: CellRenderer = (value, row, _column, _t) => {
  const currencyCode = row.currency_code || "USD"
  return (
    <MoneyAmountCell currencyCode={currencyCode} amount={value} align="right" />
  )
}

// Register built-in renderers
cellRenderers.set("text", TextRenderer)
cellRenderers.set("count", CountRenderer)
cellRenderers.set("status", StatusRenderer)
cellRenderers.set("badge_list", BadgeListRenderer)
cellRenderers.set("date", DateRenderer)
cellRenderers.set("timestamp", DateRenderer)
cellRenderers.set("currency", CurrencyRenderer)

export function getCellRenderer(
  renderType?: string,
  dataType?: string
): CellRenderer {
  if (renderType && cellRenderers.has(renderType)) {
    return cellRenderers.get(renderType)!
  }

  switch (dataType) {
    case "number":
    case "string":
      return TextRenderer
    case "date":
      return DateRenderer
    case "boolean":
      return (value, _row, _column, t) => {
        if (t) {
          return value ? t("fields.yes", "Yes") : t("fields.no", "No")
        }
        return value ? "Yes" : "No"
      }
    case "enum":
      return StatusRenderer
    case "currency":
      return CurrencyRenderer
    default:
      return TextRenderer
  }
}

export function registerCellRenderer(type: string, renderer: CellRenderer) {
  cellRenderers.set(type, renderer)
}

export function getColumnValue(row: any, column: HttpTypes.AdminColumn): any {
  if (column.computed) {
    return row
  }

  return getNestedValue(row, column.field)
}
