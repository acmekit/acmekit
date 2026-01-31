"use client"

import React from "react"
import { NavigationItemLink } from "types"
import { LinkButton } from "../../../LinkButton"
import clsx from "clsx"

type MainNavItemLinkProps = {
  item: NavigationItemLink
  isActive: boolean
  icon?: React.ReactNode
  className?: string
}

export const MainNavItemLink = ({
  item,
  isActive,
  icon,
  className,
}: MainNavItemLinkProps) => {
  return (
    <LinkButton
      href={item.link}
      className={clsx(
        isActive && "text-acmekit-fg-base",
        !isActive && "text-acmekit-fg-muted hover:text-acmekit-fg-subtle",
        className
      )}
    >
      {item.title}
      {icon}
    </LinkButton>
  )
}
