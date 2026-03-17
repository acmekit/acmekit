import { useState } from "react"
import { Button, Drawer, Input, Label } from "@medusajs/ui"

export default function DrawerWithForm() {
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <Button>Open Drawer</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Simple Form</Drawer.Title>
          </Drawer.Header>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <Drawer.Body>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Drawer.Close>
              <Button type="submit">Submit</Button>
            </Drawer.Footer>
          </form>
        </Drawer.Content>
      </Drawer>
      {submitted && (
        <div className="text-ui-fg-muted">Form submitted with name {name}</div>
      )}
    </div>
  )
}
