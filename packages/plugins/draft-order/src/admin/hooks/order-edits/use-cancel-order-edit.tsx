import { HttpTypes } from "@acmekit/types"
import { toast } from "@acmekit/ui"
import { useCallback } from "react"
import { useDraftOrderCancelEdit } from "../api/draft-orders"

interface UseCancelOrderEditProps {
  preview?: HttpTypes.AdminOrderPreview
}

export const useCancelOrderEdit = ({ preview }: UseCancelOrderEditProps) => {
  const { mutateAsync: cancelOrderEdit } = useDraftOrderCancelEdit(preview?.id!)

  const onCancel = useCallback(async () => {
    if (!preview) {
      return true
    }

    let res = false

    await cancelOrderEdit(undefined, {
      onError: (e) => {
        toast.error(e.message)
      },
      onSuccess: () => {
        res = true
      },
    })

    return res
  }, [preview, cancelOrderEdit])

  return { onCancel }
}
