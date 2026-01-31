"use client"

import React, { useEffect, useState } from "react"
import { CopyButton } from "../../../CopyButton"
import { DocsTrackingEvents } from "../../../../constants"
import { useAnalytics } from "../../../../providers/Analytics"
import clsx from "clsx"
import { CheckMini, SquareTwoStack } from "@acmekit/icons"

export type CodeBlockCopyActionProps = {
  source: string
  inHeader: boolean
}

export const CodeBlockCopyAction = ({
  source,
  inHeader,
}: CodeBlockCopyActionProps) => {
  const [copied, setCopied] = useState(false)
  const { track } = useAnalytics()

  useEffect(() => {
    if (!copied) {
      return
    }

    setTimeout(() => {
      setCopied(false)
    }, 1000)

    track({
      event: {
        event: DocsTrackingEvents.CODE_BLOCK_COPY,
        options: {
          text: source.substring(0, 150),
        },
      },
    })
  }, [copied])

  const iconClassName = [
    "text-acmekit-contrast-fg-secondary",
    "group-hover:text-acmekit-contrast-fg-primary",
    "group-focus:text-acmekit-contrast-fg-primary",
  ]

  return (
    <CopyButton
      text={source}
      tooltipClassName="font-base"
      className={clsx("group")}
      buttonClassName={clsx(!inHeader && "p-[6px]", inHeader && "p-[4.5px]")}
      tooltipInnerClassName={clsx(
        inHeader && "flex",
        "h-fit rounded-docs_sm",
        "group-hover:bg-acmekit-contrast-bg-base-hover group-focus:bg-acmekit-contrast-bg-base-hover"
      )}
      onCopy={() => setCopied(true)}
    >
      {!copied && (
        <SquareTwoStack
          className={clsx(iconClassName)}
          data-testid="not-copied-icon"
        />
      )}
      {copied && (
        <CheckMini className={clsx(iconClassName)} data-testid="copied-icon" />
      )}
    </CopyButton>
  )
}
