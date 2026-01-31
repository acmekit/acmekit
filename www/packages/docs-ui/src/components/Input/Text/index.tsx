import React from "react"
import clsx from "clsx"

export type InputTextProps = {
  className?: string
  addGroupStyling?: boolean
  passedRef?: React.Ref<HTMLInputElement>
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export const InputText = ({
  addGroupStyling = false,
  className,
  passedRef,
  ...props
}: InputTextProps) => {
  return (
    <input
      {...props}
      className={clsx(
        "bg-acmekit-bg-field-component shadow-border-base dark:shadow-border-base-dark",
        "rounded-docs_sm px-docs_0.5",
        "hover:bg-acmekit-bg-field-component-hover",
        addGroupStyling && "group-hover:bg-acmekit-bg-field-component-hover",
        "focus:border-acmekit-border-interactive",
        "active:border-acmekit-border-interactive",
        "disabled:bg-acmekit-bg-disabled",
        "disabled:border-acmekit-border-base",
        "placeholder:text-acmekit-fg-muted",
        "disabled:placeholder:text-acmekit-fg-disabled",
        "text-compact-small font-base",
        className
      )}
      ref={passedRef}
    />
  )
}
