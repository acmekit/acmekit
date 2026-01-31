import { AcmeKit } from "@acmekit/icons"
import { IconProps } from "@acmekit/icons/dist/types"
import clsx from "clsx"
import React from "react"

export const ColoredAcmeKitIcon = ({ className, ...props }: IconProps) => {
  return (
    <AcmeKit
      {...props}
      className={clsx(className, "[&_path]:fill-acmekit-fg-subtle")}
    />
  )
}
