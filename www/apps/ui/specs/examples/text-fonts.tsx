import { Text } from "@medusajs/ui"

export default function TextFonts() {
  return (
    <div className="flex flex-col gap-y-2">
      <Text family="sans">Sans font</Text>
      <Text family="mono">Mono font</Text>
    </div>
  )
}
