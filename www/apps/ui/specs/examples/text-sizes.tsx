import { Text } from "@medusajs/ui"

export default function TextSizes() {
  return (
    <div className="flex flex-col gap-y-2">
      <Text size="base">Base size</Text>
      <Text size="large">Large size</Text>
      <Text size="xlarge">XLarge size</Text>
    </div>
  )
}
