import { Button } from "@medusajs/ui"

export default function ButtonAllVariants() {
  return (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="transparent">Transparent</Button>
      <Button variant="danger">Danger</Button>
    </div>
  )
}
