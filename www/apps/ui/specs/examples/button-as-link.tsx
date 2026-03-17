import { Button } from "@medusajs/ui"

export default function ButtonAsLink() {
  return (
    <Button asChild>
      <a href="https://medusajs.com" target="_blank" rel="noopener noreferrer">
        Open Medusa Website
      </a>
    </Button>
  )
}
