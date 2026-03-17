import { StatusBadge } from "@medusajs/ui"

export default function StatusBadgeAllColors() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge color="green">Active</StatusBadge>
      <StatusBadge color="red">Error</StatusBadge>
      <StatusBadge color="orange">Pending</StatusBadge>
      <StatusBadge color="blue">Info</StatusBadge>
      <StatusBadge color="purple">Archived</StatusBadge>
      <StatusBadge color="grey">Draft</StatusBadge>
    </div>
  )
}
