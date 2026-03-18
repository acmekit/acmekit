import { InlineTip } from "/ui"

export default function InlineTipError() {
  return (
    <InlineTip
      label="Error"
      variant="error"
    >
      An error occurred. Please try again.
    </InlineTip>
  )
}