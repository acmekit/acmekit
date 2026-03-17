import { ProgressTabs, Text, Button } from "@medusajs/ui"
import * as React from "react"

export default function ProgressTabsControlled() {
  const steps = ["general", "shipping", "payment"]
  const [active, setActive] = React.useState("general")
  const currentIndex = steps.indexOf(active)

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setActive(steps[currentIndex + 1])
    }
  }
  const handlePrev = () => {
    if (currentIndex > 0) {
      setActive(steps[currentIndex - 1])
    }
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <ProgressTabs value={active} onValueChange={setActive}>
        <div className="border-b border-ui-border-base">
          <ProgressTabs.List>
            <ProgressTabs.Trigger value="general">General</ProgressTabs.Trigger>
            <ProgressTabs.Trigger value="shipping">
              Shipping
            </ProgressTabs.Trigger>
            <ProgressTabs.Trigger value="payment">Payment</ProgressTabs.Trigger>
          </ProgressTabs.List>
        </div>
        <div className="mt-2">
          <ProgressTabs.Content value="general">
            <Text size="small">This is the General step.</Text>
          </ProgressTabs.Content>
          <ProgressTabs.Content value="shipping">
            <Text size="small">This is the Shipping step.</Text>
          </ProgressTabs.Content>
          <ProgressTabs.Content value="payment">
            <Text size="small">This is the Payment step.</Text>
          </ProgressTabs.Content>
        </div>
      </ProgressTabs>
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
