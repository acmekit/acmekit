import React from "react"
import clsx from "clsx"

export type TextAreaProps = {
  className?: string
} & React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

export const TextArea = (props: TextAreaProps) => {
  return (
    <textarea
      {...props}
      className={clsx(
        "bg-medusa-bg-field shadow-border-base dark:shadow-border-base-dark",
        "rounded-docs_sm",
        "py-[6px] px-docs_0.5 text-medium font-base",
        "hover:bg-medusa-bg-field-hover",
        "focus:shadow-medusa-border-interactive-with-focus",
        "active:shadow-medusa-border-interactive-with-focus",
        "disabled:bg-medusa-bg-disabled",
        "disabled:border-medusa-border-base disabled:border disabled:shadow-none",
        "placeholder:text-medusa-fg-muted",
        "disabled:placeholder:text-medusa-fg-disabled",
        props.className
      )}
    />
  )
}
