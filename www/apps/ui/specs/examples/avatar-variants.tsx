import { Avatar } from "@medusajs/ui"

export default function AvatarVariants() {
  return (
    <div className="flex gap-4">
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        variant="rounded"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        variant="squared"
      />
    </div>
  )
}
