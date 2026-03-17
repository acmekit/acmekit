import { Calendar } from "@medusajs/ui"

function isUnavailable(date: Date) {
  // Disable all Sundays
  return date.getDay() === 0
}

export default function CalendarUnavailable() {
  return (
    <div className="flex flex-col gap-2">
      <span className="txt-small text-ui-fg-muted">
        All Sundays are unavailable for selection.
      </span>
      <Calendar isDateUnavailable={isUnavailable} />
    </div>
  )
}
