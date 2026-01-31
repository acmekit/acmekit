import React from "react"
import clsx from "clsx"

export type KbdProps = React.ComponentProps<"kbd"> & {
  variant?: "default" | "small"
}

export const Kbd = ({
  children,
  className,
  variant = "default",
  ...props
}: KbdProps) => {
  return (
    <kbd
      className={clsx(
        "rounded-docs_xs border-solid border border-acmekit-border-base",
        "inline-flex items-center justify-center",
        "px-docs_0.25",
        "bg-acmekit-bg-field",
        "text-acmekit-fg-base",
        "font-base shadow-none",
        variant === "small"
          ? "text-compact-x-small"
          : "text-compact-x-small-plus",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  )
}
