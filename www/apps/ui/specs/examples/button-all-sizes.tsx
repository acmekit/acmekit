import { Button } from "@medusajs/ui"

export default function ButtonAllSizes() {
  return (
    <div className="flex gap-4 items-center">
      <Button size="small">Small</Button>
      <Button size="base">Base</Button>
      <Button size="large">Large</Button>
      <Button size="xlarge">XLarge</Button>
    </div>
  )
}
