import { Tooltip } from "@medusajs/ui"
import { InformationCircleSolid } from "@medusajs/icons"

export default function TooltipMaxWidth() {
  return (
    <Tooltip
      content="This is a very long tooltip message that demonstrates how you can use the maxWidth prop to control the width of the tooltip."
      maxWidth={320}
      className="text-center"
    >
      <InformationCircleSolid />
    </Tooltip>
  )
}
