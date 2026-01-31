import React from "react"
import clsx from "clsx"
import { Badge } from "@/components/Badge"
import { BorderedIcon } from "@/components/BorderedIcon"
import { Link } from "@/components/Link"
import { ArrowUpRightOnBox, TriangleRightMini } from "@acmekit/icons"
import { CardProps } from "../../.."
import { useIsExternalLink } from "../../../.."

export const CardDefaultLayout = ({
  icon,
  image,
  title,
  text,
  href,
  className,
  contentClassName,
  iconClassName,
  children,
  badge,
  rightIcon: RightIconComponent,
  highlightText = [],
  onClick,
}: CardProps) => {
  const isExternal = useIsExternalLink({ href })

  const getHighlightedText = (textToHighlight: string) => {
    if (!highlightText.length) {
      return textToHighlight
    }

    const parts = textToHighlight.split(
      new RegExp(`(${highlightText.join("|")})`, "gi")
    )
    return parts.map((part, index) => {
      const isHighlighted = highlightText.some((highlight) => {
        return part.toLowerCase() === highlight.toLowerCase()
      })
      return isHighlighted ? (
        <span
          key={index}
          className="bg-acmekit-tag-blue-bg px-px rounded-s-docs_xxs"
          data-testid="highlight-text"
        >
          {part}
        </span>
      ) : (
        part
      )
    })
  }

  return (
    <div
      className={clsx(
        "bg-acmekit-bg-component w-full rounded-docs_DEFAULT",
        "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
        "py-docs_0.5 px-docs_0.75 relative",
        "flex justify-start items-center gap-docs_0.75 transition-shadow",
        href &&
          "hover:shadow-elevation-card-hover dark:hover:shadow-elevation-card-hover-dark",
        className
      )}
    >
      {icon && (
        <BorderedIcon
          wrapperClassName={clsx(
            "p-[4.5px] bg-acmekit-bg-component-hover",
            iconClassName
          )}
          IconComponent={icon}
        />
      )}
      {image && (
        <BorderedIcon
          wrapperClassName={clsx("bg-acmekit-bg-base", iconClassName)}
          icon={image}
        />
      )}
      <div
        className={clsx("flex flex-col flex-1 overflow-auto", contentClassName)}
      >
        {title && (
          <div
            className="text-small-plus text-acmekit-fg-base truncate"
            data-testid="title"
          >
            {getHighlightedText(title)}
          </div>
        )}
        {text && (
          <span
            className="text-small-plus text-acmekit-fg-subtle"
            data-testid="text"
          >
            {getHighlightedText(text)}
          </span>
        )}
        {children}
      </div>
      {badge && <Badge {...badge} />}
      <span className="text-acmekit-fg-subtle">
        {RightIconComponent && <RightIconComponent />}
        {!RightIconComponent && isExternal && (
          <ArrowUpRightOnBox data-testid="external-icon" />
        )}
        {!RightIconComponent && !isExternal && (
          <TriangleRightMini data-testid="internal-icon" />
        )}
      </span>

      {href && (
        <Link
          href={href}
          className="absolute left-0 top-0 h-full w-full rounded"
          prefetch={false}
          rel={isExternal ? "noopener noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
          aria-label={title}
          onClick={onClick}
        />
      )}
    </div>
  )
}
