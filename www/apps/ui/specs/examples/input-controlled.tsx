import { Input } from "@medusajs/ui"
import { useState } from "react"

export default function InputControlled() {
  const [value, setValue] = useState("")

  return (
    <div className="flex flex-col items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter name"
        id="controlled-input"
      />
      {value && <span>Hello, {value}!</span>}
    </div>
  )
}
