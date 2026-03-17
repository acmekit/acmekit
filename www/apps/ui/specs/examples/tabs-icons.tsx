import { Tabs, Text } from "@medusajs/ui"
import { TruckFast, CreditCard, InformationCircle } from "@medusajs/icons"

export default function TabsIcons() {
  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Trigger value="general">
            <InformationCircle className="mr-1.5 h-4 w-4" /> General
          </Tabs.Trigger>
          <Tabs.Trigger value="shipping">
            <TruckFast className="mr-1.5 h-4 w-4" /> Shipping
          </Tabs.Trigger>
          <Tabs.Trigger value="payment">
            <CreditCard className="mr-1.5 h-4 w-4" /> Payment
          </Tabs.Trigger>
        </Tabs.List>
        <div className="mt-2">
          <Tabs.Content value="general">
            <Text size="small">This is the General tab with an icon.</Text>
          </Tabs.Content>
          <Tabs.Content value="shipping">
            <Text size="small">This is the Shipping tab with an icon.</Text>
          </Tabs.Content>
          <Tabs.Content value="payment">
            <Text size="small">This is the Payment tab with an icon.</Text>
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
