import { useEffect, useCallback } from "react"
import { DropdownMenu, IconButton, toast, Toaster } from "@medusajs/ui"
import { Keyboard } from "@medusajs/icons"

function getOsShortcut() {
  const isMacOs =
    typeof navigator !== "undefined"
      ? navigator.userAgent.toLowerCase().indexOf("mac") !== 0
      : true

  return isMacOs ? "⌘" : "Ctrl"
}

export default function DropdownMenuWithShortcuts() {
  const osShortcut = getOsShortcut()
  const handleEdit = useCallback(() => {
    toast.success("Success", {
      description: "Edit shortcut triggered!",
    })
  }, [])

  const handleDelete = useCallback(() => {
    toast.success("Success", {
      description: "Delete shortcut triggered!",
    })
  }, [])

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.metaKey && e.key.toLowerCase() === "e") {
        e.preventDefault()
        handleEdit()
      }
      if (e.metaKey && e.key.toLowerCase() === "d") {
        e.preventDefault()
        handleDelete()
      }
    }
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [handleEdit, handleDelete])

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <Keyboard />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={handleEdit}>
            Edit
            <DropdownMenu.Shortcut>{osShortcut}E</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleDelete}>
            Delete
            <DropdownMenu.Shortcut>{osShortcut}D</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <Toaster />
    </>
  )
}
