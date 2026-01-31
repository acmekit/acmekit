"use client"

import React from "react"
import { CodeBlock, CodeBlockProps } from "../CodeBlock"
import clsx from "clsx"

export type VerticalCodeTab = {
  title: string
  code: CodeBlockProps
} & Record<string, unknown>

export type VerticalCodeTabsProps = {
  tabs: VerticalCodeTab[]
  className?: string
  selectedTabIndex: number
  setSelectedTabIndex: (value: number) => void
}

export const VerticalCodeTabs = ({
  tabs,
  className,
  selectedTabIndex,
  setSelectedTabIndex,
}: VerticalCodeTabsProps) => {
  return (
    <div
      className={clsx(
        "rounded-[20px] bg-acmekit-bg-subtle p-docs_0.5",
        "shadow-elevation-modal dark:shadow-elevation-modal-dark",
        className
      )}
      data-testid="vertical-code-tabs-container"
    >
      <div
        className={clsx(
          "rounded-docs_lg bg-acmekit-contrast-bg-base h-full",
          "shadow-elevation-code-block dark:shadow-elevation-code-block-dark",
          "flex flex-col"
        )}
      >
        <div
          className={clsx(
            "px-docs_1 py-docs_0.75",
            "flex gap-[6px] items-center"
          )}
        >
          {new Array(3).fill(0).map((_, index) => (
            <span
              className={clsx(
                "inline-block rounded-full w-[10px] h-[10px]",
                "bg-acmekit-contrast-border-bot border border-acmekit-contrast-border-bot"
              )}
              key={index}
              data-testid="vertical-code-tabs-dot"
            />
          ))}
        </div>
        <div
          className={clsx(
            "flex flex-1 gap-[6px] items-start px-[5px] pb-[5px]"
          )}
        >
          <ul className="2xl:w-[180px] flex flex-col gap-[6px] shrink-0">
            {tabs.map((tab, index) => (
              <li
                className={clsx(
                  "px-docs_0.75 py-[11px]",
                  "rounded-docs_DEFAULT border border-acmekit-contrast-border-bot",
                  "text-code-body font-monospace cursor-pointer",
                  selectedTabIndex === index &&
                    "text-acmekit-contrast-fg-primary bg-acmekit-contrast-border-bot",
                  selectedTabIndex !== index &&
                    "text-acmekit-contrast-fg-secondary bg-acmekit-contrast-bg-subtle hover:bg-acmekit-contrast-border-bot"
                )}
                onClick={() => setSelectedTabIndex(index)}
                key={index}
              >
                {tab.title}
              </li>
            ))}
          </ul>
          <div className="flex-1 h-[388px] max-w-full overflow-hidden rounded-docs_DEFAULT [&_pre]:min-h-full">
            <CodeBlock
              {...tabs[selectedTabIndex].code}
              noCopy={true}
              noReport={true}
              noAskAi={true}
              forceNoTitle={true}
              wrapperClassName="h-full !rounded-docs_DEFAULT"
              className={clsx(
                "overflow-auto h-full max-h-full !mb-0 !rounded-docs_DEFAULT",
                "!border !border-acmekit-contrast-border-bot"
              )}
              innerClassName="h-full"
              animateTokenHighlights
              overrideColors={{
                bg: "bg-acmekit-contrast-bg-subtle",
                innerBg: "bg-acmekit-contrast-bg-subtle",
                lineNumbersBg: "bg-acmekit-contrast-bg-subtle",
                boxShadow: "shadow-none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
