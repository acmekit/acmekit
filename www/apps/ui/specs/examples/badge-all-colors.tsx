import { Badge } from "@medusajs/ui"

export default function BadgeAllColors() {
  return (
    <div className="flex gap-3">
      <Badge color="grey">Grey</Badge>
      <Badge color="red">Red</Badge>
      <Badge color="green">Green</Badge>
      <Badge color="blue">Blue</Badge>
      <Badge color="orange">Orange</Badge>
      <Badge color="purple">Purple</Badge>
    </div>
  )
}
