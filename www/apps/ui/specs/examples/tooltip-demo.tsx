import { InformationCircleSolid } from "@acmekit/icons"
import { Tooltip } from "@acmekit/ui"

export default function TooltipDemo() {
  return (
    <Tooltip content="The quick brown fox jumps over the lazy dog.">
      <InformationCircleSolid />
    </Tooltip>
  )
}
