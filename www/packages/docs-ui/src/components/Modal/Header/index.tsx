import React from "react"
import clsx from "clsx"
import { useModal } from "@/providers/Modal"
import { Button } from "@/components/Button"
import { XMark } from "@acmekit/icons"

export type ModalHeaderProps = {
  title?: React.ReactNode
}

export const ModalHeader = ({ title }: ModalHeaderProps) => {
  const { closeModal } = useModal()

  return (
    <div
      className={clsx(
        "border-acmekit-border-base border-0 border-b border-solid py-docs_1.5 px-docs_2",
        "flex items-center justify-between"
      )}
    >
      <span className={clsx("text-acmekit-fg-base text-h2")} data-testid="title">
        {title}
      </span>
      <Button
        variant="transparent"
        className="cursor-pointer"
        onClick={() => closeModal()}
      >
        <XMark />
      </Button>
    </div>
  )
}
