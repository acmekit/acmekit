import { PlusMini } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"

export default function IconButtonLoading() {
  return (
    <IconButton isLoading className="relative">
      <PlusMini />
    </IconButton>
  )
}
