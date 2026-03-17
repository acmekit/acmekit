import {
  CheckCircle,
  ExclamationCircle,
  InformationCircle,
  Spinner,
  XCircle,
} from "@medusajs/icons"
import { Button, toast } from "@medusajs/ui"

export default function ToasterAllVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() =>
          toast.info("Info", {
            description: "This is an info toast.",
          })
        }
      >
        <InformationCircle /> Info
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.success("Success", {
            description: "This is a success toast.",
          })
        }
      >
        <CheckCircle /> Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error("Error", {
            description: "This is an error toast.",
          })
        }
      >
        <XCircle /> Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning("Warning", {
            description: "This is a warning toast.",
          })
        }
      >
        <ExclamationCircle /> Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.loading("Loading", {
            description: "This is a loading toast.",
          })
        }
      >
        <Spinner /> Loading
      </Button>
    </div>
  )
}
