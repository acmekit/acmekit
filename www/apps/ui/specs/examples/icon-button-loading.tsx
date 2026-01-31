import { PlusMini } from "@acmekit/icons"
import { IconButton } from "@acmekit/ui"

export default function IconButtonLoading() {
  return (
    <IconButton isLoading className="relative">
      <PlusMini />
    </IconButton>
  )
}
