import { Tooltip } from "@acmekit/ui"
import { ComponentPropsWithoutRef, PropsWithChildren } from "react"

type ConditionalTooltipProps = PropsWithChildren<
  ComponentPropsWithoutRef<typeof Tooltip> & {
    showTooltip?: boolean
  }
>

export const ConditionalTooltip = ({
  children,
  showTooltip = false,
  ...props
}: ConditionalTooltipProps) => {
  if (showTooltip) {
    return <Tooltip {...props}>{children}</Tooltip>
  }

  return children
}
