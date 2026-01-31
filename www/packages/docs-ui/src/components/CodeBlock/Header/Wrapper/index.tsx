import clsx from "clsx"
import React, { useMemo } from "react"
import { useColorMode } from "../../../../providers/ColorMode"
import { CodeBlockStyle } from "../../../CodeBlock"

export type CodeBlockHeaderWrapperProps = {
  blockStyle?: CodeBlockStyle
  children: React.ReactNode
}

export const CodeBlockHeaderWrapper = React.forwardRef<
  HTMLDivElement,
  CodeBlockHeaderWrapperProps
>(function CodeBlockHeaderWrapper({ children, blockStyle = "loud" }, ref) {
  const { colorMode } = useColorMode()

  const bgColor = useMemo(
    () =>
      clsx(
        blockStyle === "loud" && "bg-acmekit-contrast-bg-base",
        blockStyle === "subtle" && [
          colorMode === "light" && "bg-acmekit-bg-component",
          colorMode === "dark" && "bg-acmekit-code-bg-header",
        ]
      ),
    [blockStyle, colorMode]
  )

  return (
    <div
      className={clsx(
        "py-docs_0.5 px-docs_1 mb-0",
        "rounded-t-docs_lg relative flex justify-between items-center",
        blockStyle === "subtle" && [
          "border border-solid border-b-0",
          colorMode === "light" && "border-acmekit-border-base",
          colorMode === "dark" && "border-acmekit-code-border",
        ],
        bgColor
      )}
      ref={ref}
    >
      {children}
    </div>
  )
})
