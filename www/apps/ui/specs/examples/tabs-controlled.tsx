import { Tabs, Text } from "@medusajs/ui"
import { useState } from "react"

export default function TabsControlled() {
  const [value, setValue] = useState("general")
  return (
    <div className="w-full px-4 flex flex-col">
      <Tabs value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="shipping">Shipping</Tabs.Trigger>
          <Tabs.Trigger value="payment">Payment</Tabs.Trigger>
        </Tabs.List>
        <div className="mt-2">
          <Tabs.Content value="general">
            <Text size="small">This is the General tab (controlled).</Text>
          </Tabs.Content>
          <Tabs.Content value="shipping">
            <Text size="small">This is the Shipping tab (controlled).</Text>
          </Tabs.Content>
          <Tabs.Content value="payment">
            <Text size="small">This is the Payment tab (controlled).</Text>
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
