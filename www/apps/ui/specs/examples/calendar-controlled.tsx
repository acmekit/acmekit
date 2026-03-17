import { Calendar } from "@medusajs/ui"
import { useState } from "react"

export default function CalendarControlled() {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <div className="flex flex-col gap-2">
      <Calendar value={date} onChange={setDate} />
      <span className="txt-small text-ui-fg-muted">
        Selected: {date?.toDateString() ?? "None"}
      </span>
    </div>
  )
}
