import { ProgressTabs, Text } from "@medusajs/ui"

export default function ProgressTabsDisabled() {
  return (
    <div className="w-full px-4">
      <ProgressTabs defaultValue="general">
        <div className="border-b border-ui-border-base">
          <ProgressTabs.List>
            <ProgressTabs.Trigger value="general">General</ProgressTabs.Trigger>
            <ProgressTabs.Trigger value="shipping" disabled>
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
            <Text size="small">This is the Shipping step (disabled).</Text>
          </ProgressTabs.Content>
          <ProgressTabs.Content value="payment">
            <Text size="small">This is the Payment step.</Text>
          </ProgressTabs.Content>
        </div>
      </ProgressTabs>
    </div>
  )
}
