"use client"

import React from "react"
import { useColorMode } from "@/providers/ColorMode"
import clsx from "clsx"
import { BaseTabType } from "../../../hooks/use-tabs"
import { useScrollPositionBlocker } from "../../../hooks/use-scroll-utils"

type CodeTabProps = BaseTabType & {
  // Children are handled in MDX to allow for code blocks and inline code to be rendered
  children: React.ReactNode
  isSelected?: boolean
  blockStyle?: string
  changeSelectedTab?: (tab: BaseTabType) => void
  pushRef?: (tabButton: HTMLButtonElement | null) => void
}

export const CodeTab = ({
  label,
  value,
  isSelected = false,
  blockStyle = "loud",
  changeSelectedTab,
  pushRef,
}: CodeTabProps) => {
  const { colorMode } = useColorMode()
  const { blockElementScrollPositionUntilNextRender } =
    useScrollPositionBlocker()

  return (
    <li>
      <button
        className={clsx(
          "text-compact-x-small-plus font-base xs:border-0 pb-docs_0.5 relative",
          !isSelected && [
            blockStyle === "loud" && "text-acmekit-contrast-fg-secondary",
            blockStyle === "subtle" && [
              colorMode === "light" &&
                "text-acmekit-fg-subtle hover:bg-acmekit-bg-base",
              colorMode === "dark" &&
                "text-acmekit-contrast-fg-secondary hover:bg-acmekit-code-bg-base",
            ],
          ],
          isSelected && [
            blockStyle === "loud" && "text-acmekit-contrast-fg-primary",
            blockStyle === "subtle" && [
              colorMode === "light" &&
                "xs:border-acmekit-border-base text-acmekit-contrast-fg-primary",
              colorMode === "dark" &&
                "xs:border-acmekit-code-border text-acmekit-contrast-fg-primary",
            ],
          ]
        )}
        ref={(tabButton) => pushRef?.(tabButton)}
        onClick={(e) => {
          blockElementScrollPositionUntilNextRender(
            e.target as HTMLButtonElement
          )
          changeSelectedTab?.({ label, value })
        }}
        aria-selected={isSelected}
        role="tab"
      >
        {label}
      </button>
    </li>
  )
}
