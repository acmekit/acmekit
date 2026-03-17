import { ProgressAccordion, Text, Button } from "@medusajs/ui"
import * as React from "react"

export default function ProgressAccordionControlled() {
  const [open, setOpen] = React.useState<string>("general")
  const steps = ["general", "shipping", "payment"]
  const currentIndex = steps.indexOf(open)

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setOpen(steps[currentIndex + 1])
    }
  }
  const handlePrev = () => {
    if (currentIndex > 0) {
      setOpen(steps[currentIndex - 1])
    }
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <ProgressAccordion type="single" value={open} onValueChange={setOpen}>
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header>General</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6 flex flex-col gap-2">
              <Text size="small">This is the General step.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping">
          <ProgressAccordion.Header>Shipping</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6 flex flex-col gap-2">
              <Text size="small">This is the Shipping step.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="payment">
          <ProgressAccordion.Header>Payment</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6 flex flex-col gap-2">
              <Text size="small">This is the Payment step.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
      <div className="mt-4 flex gap-2 self-end">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Prev
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentIndex === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
