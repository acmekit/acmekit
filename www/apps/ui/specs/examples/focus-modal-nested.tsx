import { Button, FocusModal } from "@medusajs/ui"

export default function NestedFocusModals() {
  return (
    <FocusModal>
      <FocusModal.Trigger asChild>
        <Button>Open Outer Modal</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>Outer Modal</FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="p-6 flex flex-col space-y-2">
          <p>This is the outer modal.</p>
          <FocusModal>
            <FocusModal.Trigger asChild>
              <Button variant="secondary">Open Nested Modal</Button>
            </FocusModal.Trigger>
            <FocusModal.Content>
              <FocusModal.Header>
                <FocusModal.Title>Nested Modal</FocusModal.Title>
              </FocusModal.Header>
              <FocusModal.Body className="p-6">
                <p>This is a nested focus modal for additional information.</p>
              </FocusModal.Body>
            </FocusModal.Content>
          </FocusModal>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}
