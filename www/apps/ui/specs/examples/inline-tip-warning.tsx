import { InlineTip } from "/ui"

export default function InlineTipWarning() {
  return (
    <InlineTip
      label="Warning"
      variant="warning"
    >
      This action cannot be undone.
    </InlineTip>
  )
}