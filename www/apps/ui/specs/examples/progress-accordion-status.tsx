import { ProgressAccordion, Text } from "@medusajs/ui"

export default function ProgressAccordionStatus() {
  return (
    <div className="w-full px-4">
      <ProgressAccordion type="single">
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header status="not-started">
            General
          </ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">This step has not started yet.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping">
          <ProgressAccordion.Header status="in-progress">
            Shipping
          </ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">This step is in progress.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="payment">
          <ProgressAccordion.Header status="completed">
            Payment
          </ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">This step is completed.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
    </div>
  )
}
