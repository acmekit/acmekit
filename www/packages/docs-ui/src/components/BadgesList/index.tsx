import React from "react"
import { Badge, BadgeProps } from "../Badge"
import clsx from "clsx"

type BadgesListProps = {
  badges: BadgeProps[]
  className?: string
}

export const BadgesList = ({ badges, className }: BadgesListProps) => {
  return (
    <div className={clsx("flex flex-wrap gap-docs_0.5", className)}>
      {badges.map((badgeProps, index) => (
        <Badge {...badgeProps} key={index} />
      ))}
    </div>
  )
}
