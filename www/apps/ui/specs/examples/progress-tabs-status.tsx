import { ProgressTabs, Text } from "@medusajs/ui"

export default function ProgressTabsStatus() {
  return (
    <div className="w-full px-4">
      <ProgressTabs defaultValue="general">
        <div className="border-b border-ui-border-base">
          <ProgressTabs.List>
            <ProgressTabs.Trigger value="general" status="completed">
              General
            </ProgressTabs.Trigger>
            <ProgressTabs.Trigger value="shipping" status="in-progress">
              Shipping
            </ProgressTabs.Trigger>
            <ProgressTabs.Trigger value="payment" status="not-started">
              Payment
            </ProgressTabs.Trigger>
          </ProgressTabs.List>
        </div>
        <div className="mt-2">
          <ProgressTabs.Content value="general">
            <Text size="small">General step is completed.</Text>
          </ProgressTabs.Content>
          <ProgressTabs.Content value="shipping">
            <Text size="small">Shipping step is in progress.</Text>
          </ProgressTabs.Content>
          <ProgressTabs.Content value="payment">
            <Text size="small">Payment step has not started.</Text>
          </ProgressTabs.Content>
        </div>
      </ProgressTabs>
    </div>
  )
}
