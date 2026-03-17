import { Text } from "@medusajs/ui"

export default function TextLeading() {
  return (
    <div className="flex flex-col gap-y-2">
      <Text leading="normal">Normal leading</Text>
      <Text leading="compact">Compact leading</Text>
    </div>
  )
}
