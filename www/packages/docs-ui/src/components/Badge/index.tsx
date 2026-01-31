import React from "react"
import clsx from "clsx"
import { ShadedBgIcon } from "../Icons/ShadedBg"

export type BadgeVariant =
  | "purple"
  | "orange"
  | "green"
  | "blue"
  | "red"
  | "neutral"
  | "code"

export type BadgeType = "default" | "shaded"

export type BadgeProps = {
  className?: string
  childrenWrapperClassName?: string
  variant: BadgeVariant
  badgeType?: BadgeType
} & React.HTMLAttributes<HTMLSpanElement>

export const Badge = ({
  className,
  variant,
  badgeType = "default",
  children,
  childrenWrapperClassName,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        "text-compact-x-small-plus text-center",
        badgeType === "default" &&
          "px-docs_0.25 py-0 rounded-docs_sm border border-solid",
        variant === "purple" &&
          "bg-acmekit-tag-purple-bg text-acmekit-tag-purple-text border-acmekit-tag-purple-border",
        variant === "orange" &&
          "bg-acmekit-tag-orange-bg text-acmekit-tag-orange-text border-acmekit-tag-orange-border",
        variant === "green" &&
          "bg-acmekit-tag-green-bg text-acmekit-tag-green-text border-acmekit-tag-green-border",
        variant === "blue" &&
          "bg-acmekit-tag-blue-bg text-acmekit-tag-blue-text border-acmekit-tag-blue-border",
        variant === "red" &&
          "bg-acmekit-tag-red-bg text-acmekit-tag-red-text border-acmekit-tag-red-border",
        variant === "neutral" &&
          "bg-acmekit-tag-neutral-bg text-acmekit-tag-neutral-text border-acmekit-tag-neutral-border",
        variant === "code" &&
          "bg-acmekit-contrast-bg-subtle text-acmekit-contrast-fg-secondary border-acmekit-contrast-border-bot",
        badgeType === "shaded" && "px-[3px] !bg-transparent relative",
        // needed for tailwind utilities
        "badge",
        className
      )}
      {...props}
    >
      {badgeType === "shaded" && (
        <ShadedBgIcon
          variant={variant}
          className={clsx("absolute top-0 left-0 w-full h-full")}
        />
      )}
      <span
        className={clsx(
          badgeType === "shaded" && "relative z-[1]",
          childrenWrapperClassName
        )}
      >
        {children}
      </span>
    </span>
  )
}
