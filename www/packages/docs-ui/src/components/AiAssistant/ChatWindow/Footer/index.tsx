import React from "react"
import clsx from "clsx"
import { Kbd } from "../../../Kbd"
import { KapaIcon } from "../../../Icons/Kapa"
import { Tooltip } from "../../../Tooltip"

export const AiAssistantChatWindowFooter = () => {
  return (
    <div
      className={clsx(
        "bg-acmekit-bg-component border-t border-acmekit-border-base",
        "flex items-center justify-between gap-docs_0.75 text-compact-x-small",
        "py-docs_0.75 px-docs_1"
      )}
    >
      <Tooltip text="Powered by Kapa.ai">
        <a href="https://kapa.ai" target="_blank" rel="noreferrer">
          <KapaIcon className="text-acmekit-fg-disabled hover:text-acmekit-fg-muted transition-colors" />
        </a>
      </Tooltip>
      <div className="flex items-center justify-end gap-docs_0.75">
        <span className="text-acmekit-fg-muted">Chat is cleared on refresh</span>
        <span className="h-docs_0.75 w-px bg-acmekit-border-base"></span>
        <div className="flex items-center gap-docs_0.5">
          <span className="text-acmekit-fg-subtle">Line break</span>
          <div className="flex items-center gap-[5px]">
            <Kbd className="bg-acmekit-bg-field-component border-acmekit-border-strong w-[18px] h-[18px] inline-block p-0">
              ⇧
            </Kbd>
            <Kbd className="bg-acmekit-bg-field-component border-acmekit-border-strong w-[18px] h-[18px] inline-block p-0">
              ↵
            </Kbd>
          </div>
        </div>
      </div>
    </div>
  )
}
