import { Tabs, Text } from "@medusajs/ui"

export default function TabsVertical() {
  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Tabs defaultValue="general" orientation="vertical" className="flex">
        <Tabs.List className="flex-col min-w-[120px] border-r border-ui-border-base">
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="shipping">Shipping</Tabs.Trigger>
          <Tabs.Trigger value="payment">Payment</Tabs.Trigger>
        </Tabs.List>
        <div className="ml-6 flex-1">
          <Tabs.Content value="general">
            <Text size="small">This is the General tab (vertical).</Text>
          </Tabs.Content>
          <Tabs.Content value="shipping">
            <Text size="small">This is the Shipping tab (vertical).</Text>
          </Tabs.Content>
          <Tabs.Content value="payment">
            <Text size="small">This is the Payment tab (vertical).</Text>
          </Tabs.Content>
        </div>
      </Tabs>
      <Text size="xsmall" className="text-ui-fg-muted">
        Use the up and down arrow keys to navigate between the tabs. You must
        focus on a tab first.
      </Text>
    </div>
  )
}
