import { Button } from "@acmekit/ui"

export default function ButtonAsLink() {
  return (
    <Button asChild>
      <a href="https://acmekit.com" target="_blank" rel="noopener noreferrer">
        Open AcmeKit Website
      </a>
    </Button>
  )
}
