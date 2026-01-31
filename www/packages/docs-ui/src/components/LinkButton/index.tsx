import React from "react"

import type { LinkProps as NextLinkProps } from "next/link"
import Link from "next/link"
import clsx from "clsx"

type LinkButtonProps = NextLinkProps & {
  variant?: "base" | "interactive" | "subtle" | "muted"
  className?: string
} & React.AllHTMLAttributes<HTMLAnchorElement>

export const LinkButton = ({
  variant = "base",
  className,
  ...linkProps
}: LinkButtonProps) => {
  return (
    <Link
      {...linkProps}
      className={clsx(
        className,
        "inline-flex justify-center items-center",
        "gap-docs_0.25 rounded-docs_xs",
        "text-compact-small-plus disabled:text-acmekit-fg-disabled",
        "focus:shadow-borders-focus no-underline",
        variant === "base" && [
          "text-acmekit-fg-base hover:text-acmekit-fg-subtle",
          "focus:text-acmekit-fg-base",
        ],
        variant === "interactive" && [
          "text-acmekit-fg-interactive hover:text-acmekit-interactive-hover",
          "focus:text-acmekit-fg-interactive",
        ],
        variant === "subtle" && [
          "text-acmekit-fg-subtle hover:text-acmekit-fg-base",
          "focus:text-acmekit-fg-subtle",
        ],
        variant === "muted" && [
          "text-acmekit-fg-muted hover:text-acmekit-fg-subtle",
          "focus:text-acmekit-fg-muted",
        ]
      )}
    />
  )
}
