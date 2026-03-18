import { Button, toast } from "/ui"

export default function DismissableToaster() {
  return (
    <Button
      onClick={() =>
        toast.info("Info", {
          description: "The quick brown fox jumps over the lazy dog.",
          dismissable: true,
        })
      }
    >
      Show
    </Button>
  )
}
