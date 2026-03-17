import { Button, FocusModal, Heading, Input, Label, Text } from "@medusajs/ui"
import { useState } from "react"

export default function FocusModalControlled() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Edit Variant</Button>
      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <FocusModal.Header>
            <FocusModal.Title>Edit Variant</FocusModal.Title>
          </FocusModal.Header>
          <FocusModal.Body className="flex flex-col items-center py-16">
            <div className="flex w-full max-w-lg flex-col gap-y-8">
              <div className="flex flex-col gap-y-1">
                <Heading>Create API key</Heading>
                <Text className="text-ui-fg-subtle">
                  Create and manage API keys. You can create multiple keys to
                  organize your applications.
                </Text>
              </div>
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="key_name" className="text-ui-fg-subtle">
                  Key name
                </Label>
                <Input id="key_name" placeholder="my_app" />
              </div>
            </div>
          </FocusModal.Body>
          <FocusModal.Footer>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </FocusModal.Footer>
        </FocusModal.Content>
      </FocusModal>
    </div>
  )
}
