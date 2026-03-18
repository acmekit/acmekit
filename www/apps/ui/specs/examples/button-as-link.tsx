import { Button } from "@acmekit/ui"

export default function ButtonAsLink() {
  return (
    <Button asChild>
      <a href="https://medusajs.com" target="_blank" rel="noopener noreferrer">
        Open Medusa Website
      </a>
    </Button>
  )
}
