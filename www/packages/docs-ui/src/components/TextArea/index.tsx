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
        "bg-acmekit-bg-field shadow-border-base dark:shadow-border-base-dark",
        "rounded-docs_sm",
        "py-[6px] px-docs_0.5 text-medium font-base",
        "hover:bg-acmekit-bg-field-hover",
        "focus:shadow-acmekit-border-interactive-with-focus",
        "active:shadow-acmekit-border-interactive-with-focus",
        "disabled:bg-acmekit-bg-disabled",
        "disabled:border-acmekit-border-base disabled:border disabled:shadow-none",
        "placeholder:text-acmekit-fg-muted",
        "disabled:placeholder:text-acmekit-fg-disabled",
        props.className
      )}
    />
  )
}
