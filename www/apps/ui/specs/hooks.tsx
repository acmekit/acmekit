import dynamic from "next/dynamic"
import * as React from "react"

export type HookRegistryItem = {
  table: React.ComponentType
}

export const HookRegistry: Record<string, HookRegistryItem> = {
  usePromptReturn: {
    table: dynamic(async () =>
      import("./hooks/usePrompt").then((m) => m.Return)
    ),
  },
  useToggleStateProps: {
    table: dynamic(async () =>
      import("./hooks/useToggleState").then((m) => m.Props)
    ),
  },
  useToggleStateReturn: {
    table: dynamic(async () =>
      import("./hooks/useToggleState").then((m) => m.Return)
    ),
  },
}
