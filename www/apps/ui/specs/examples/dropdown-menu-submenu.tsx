import { DropdownMenu, IconButton } from "@medusajs/ui"
import { BarsArrowDown } from "@medusajs/icons"

export default function DropdownMenuSubmenu() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <BarsArrowDown />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.SubMenu>
          <DropdownMenu.SubMenuTrigger>
            More Actions
          </DropdownMenu.SubMenuTrigger>
          <DropdownMenu.SubMenuContent>
            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
            <DropdownMenu.Item>Archive</DropdownMenu.Item>
          </DropdownMenu.SubMenuContent>
        </DropdownMenu.SubMenu>
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
