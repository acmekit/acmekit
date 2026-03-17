import { Calendar } from "@medusajs/ui"

export default function CalendarMinMax() {
  const min = new Date()
  const max = new Date()
  max.setDate(max.getDate() + 10)
  return (
    <div className="flex flex-col gap-2">
      <span className="txt-small text-ui-fg-muted">
        Selectable dates: {min.toDateString()} to {max.toDateString()}
      </span>
      <Calendar minValue={min} maxValue={max} />
    </div>
  )
}
