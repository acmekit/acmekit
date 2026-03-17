import { Button, Prompt } from "@medusajs/ui"

export default function PromptConfirmation() {
  return (
    <Prompt variant="confirmation">
      <Prompt.Trigger asChild>
        <Button>Open Confirmation</Button>
      </Prompt.Trigger>
      <Prompt.Content>
        <Prompt.Header>
          <Prompt.Title>Confirm Action</Prompt.Title>
          <Prompt.Description>
            Are you sure you want to proceed? This action can be undone.
          </Prompt.Description>
        </Prompt.Header>
        <Prompt.Footer>
          <Prompt.Cancel>Cancel</Prompt.Cancel>
          <Prompt.Action>Confirm</Prompt.Action>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  )
}
