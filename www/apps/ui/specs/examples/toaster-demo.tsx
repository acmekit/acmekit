import { Button, Toaster, toast } from "@acmekit/ui"

export default function ToasterDemo() {
  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast.info("Info", {
            description: "The quick brown fox jumps over the lazy dog.",
          })
        }
      >
        Show
      </Button>
    </>
  )
}
