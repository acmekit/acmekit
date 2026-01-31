import React from "react"
import { IconProps } from "@acmekit/icons/dist/types"
import clsx from "clsx"

type InlineIconProps = IconProps & {
  Icon: React.ComponentType<IconProps>
  alt?: string
}

export const InlineIcon = ({ Icon, alt, ...props }: InlineIconProps) => {
  return (
    <Icon
      {...props}
      className={clsx(
        "text-acmekit-fg-subtle inline-block align-middle",
        props.className
      )}
      aria-label={alt}
    />
  )
}
