import { Avatar } from "@medusajs/ui"

export default function AvatarAccessible() {
  return (
    <Avatar
      src="https://avatars.githubusercontent.com/u/10656202?v=4"
      fallback="M"
      aria-label="Medusa User"
    />
  )
}
