import { Avatar } from "@medusajs/ui"

export default function AvatarCustomStyle() {
  return (
    <Avatar
      src="https://avatars.githubusercontent.com/u/10656202?v=4"
      fallback="M"
      style={{
        boxShadow: "0 0 0 3px #fdba74, 0 1px 2px 0 rgba(0,0,0,0.05)",
        border: "none",
      }}
    />
  )
}
