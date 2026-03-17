import { Avatar } from "@medusajs/ui"

export default function AvatarSizes() {
  return (
    <div className="flex gap-4 items-center">
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="2xsmall"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="xsmall"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="small"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="base"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="large"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="xlarge"
      />
    </div>
  )
}
