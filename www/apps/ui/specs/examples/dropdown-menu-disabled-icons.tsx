import { DropdownMenu, IconButton } from "@medusajs/ui"
import { Trash, BarsThree } from "@medusajs/icons"

export default function DropdownMenuDisabledAndIcons() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <BarsThree />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          <Trash className="mr-2" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
