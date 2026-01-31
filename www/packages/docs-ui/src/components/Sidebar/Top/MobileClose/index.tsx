"use client"

import React from "react"
import { useSidebar } from "@/providers/Sidebar"
import { Button } from "@/components/Button"
import { XMarkMini } from "@acmekit/icons"

export const SidebarTopMobileClose = () => {
  const { setMobileSidebarOpen } = useSidebar()

  return (
    <div className="m-docs_0.75 lg:hidden">
      <Button
        variant="transparent-clear"
        onClick={() => setMobileSidebarOpen(false)}
        className="!p-0 hover:!bg-transparent"
      >
        <XMarkMini className="text-acmekit-fg-subtle" />
      </Button>
    </div>
  )
}
