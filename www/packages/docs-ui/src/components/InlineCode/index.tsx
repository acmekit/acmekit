"use client"

import React from "react"
import clsx from "clsx"
import { CopyButton } from "@/components/CopyButton"

export type InlineCodeProps = React.ComponentProps<"code"> & {
  variant?: "default" | "grey-bg"
}

export const InlineCode = ({
  variant = "default",
  ...props
}: InlineCodeProps) => {
  return (
    <CopyButton
      text={props.children as string}
      buttonClassName={clsx(
        "bg-transparent border-0 p-0 inline text-acmekit-fg-subtle group",
        "font-monospace"
      )}
    >
      <code
        {...props}
        className={clsx(
          "text-acmekit-tag-neutral-text border whitespace-break-spaces",
          "font-monospace text-code-label rounded-docs_sm py-0 px-[5px]",
          variant === "default" && [
            "bg-acmekit-tag-neutral-bg group-hover:bg-acmekit-tag-neutral-bg-hover",
            "group-active:bg-acmekit-bg-subtle-pressed group-focus:bg-acmekit-bg-subtle-pressed",
            "border-acmekit-tag-neutral-border",
          ],
          variant === "grey-bg" && [
            "bg-acmekit-bg-switch-off group-hover:bg-acmekit-bg-switch-off-hover",
            "group-active:bg-acmekit-bg-switch-off-hover group-focus:bg-acmekit-switch-off-hover",
            "border-acmekit-border-strong",
          ],
          props.className
        )}
      />
    </CopyButton>
  )
}
