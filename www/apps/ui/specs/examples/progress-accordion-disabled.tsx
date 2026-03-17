import { ProgressAccordion, Text } from "@medusajs/ui"

export default function ProgressAccordionDisabled() {
  return (
    <div className="w-full px-4">
      <ProgressAccordion type="single">
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header>General</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">This step is enabled.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping" disabled>
          <ProgressAccordion.Header>Shipping</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                This step is disabled and cannot be opened.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
    </div>
  )
}
