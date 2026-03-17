import { Tabs, Text } from "@medusajs/ui"

export default function TabsDisabled() {
  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="shipping" disabled>
            Shipping (Disabled)
          </Tabs.Trigger>
          <Tabs.Trigger value="payment">Payment</Tabs.Trigger>
        </Tabs.List>
        <div className="mt-2">
          <Tabs.Content value="general">
            <Text size="small">This is the General tab.</Text>
          </Tabs.Content>
          <Tabs.Content value="shipping">
            <Text size="small">
              This is the Shipping tab (should be disabled).
            </Text>
          </Tabs.Content>
          <Tabs.Content value="payment">
            <Text size="small">This is the Payment tab.</Text>
          </Tabs.Content>
        </div>
      </Tabs>
      <Text size="xsmall" className="text-ui-fg-muted">
        Use the left and right arrow keys to navigate between the tabs. You must
        focus on a tab first.
      </Text>
    </div>
  )
}
