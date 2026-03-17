import { useState } from "react"
import { Textarea } from "@medusajs/ui"

export default function TextareaControlled() {
  const [value, setValue] = useState("")
  return (
    <div className="flex flex-col gap-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write your feedback..."
        aria-label="Feedback"
      />
      <div className="text-ui-fg-muted txt-compact-small">
        {value.length} characters
      </div>
    </div>
  )
}
