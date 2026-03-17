import { Button, FocusModal, Input, Label } from "@medusajs/ui"
import { useState } from "react"

export default function FocusModalForm() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Trigger asChild>
          <Button>Create Item</Button>
        </FocusModal.Trigger>
        <FocusModal.Content>
          <FocusModal.Header>
            <FocusModal.Title>Create Item</FocusModal.Title>
          </FocusModal.Header>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <FocusModal.Body>
              <div className="p-6">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </FocusModal.Body>
            <FocusModal.Footer>
              <Button type="submit">Submit</Button>
            </FocusModal.Footer>
          </form>
        </FocusModal.Content>
      </FocusModal>
      {value && (
        <div className="text-ui-fg-muted">
          Form submitted with name: {value}
        </div>
      )}
    </div>
  )
}
