"use client"

import React from "react"
import { CopyButton, H2, Hr, MarkdownContent, useColorMode } from "docs-ui"
import { colors as allColors } from "@/config/colors"
import { clx } from "@medusajs/ui"
import slugify from "slugify"

type Color = {
  name: string
  code: string
}

type ColorsTable = {
  [k: string]: {
    description?: string
    colors: Color[]
  }
}

interface ColorBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  colour: Color
}

const ColorBlock = ({ colour, className, ...props }: ColorBlockProps) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="flex w-fit flex-row items-center gap-x-2">
        <div
          className={
            "border-medusa-border-base h-[48px] w-[48px] rounded-lg border p-1"
          }
        >
          <div
            className={clx(
              "bg-medusa-bg-component h-full w-full animate-pulse rounded-[4px]",
              className
            )}
            {...props}
          />
        </div>
        <div className="flex flex-col items-start">
          <div className="bg-medusa-bg-component h-[20px] w-[85px] animate-pulse rounded-sm" />
          <div className="bg-medusa-bg-subtle h-[20px] w-[120px] animate-pulse rounded-sm" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-row items-center gap-x-2">
      <div
        className={
          "border-medusa-border-base h-[48px] w-[48px] rounded-lg border p-1"
        }
      >
        <div
          className={clx("h-full w-full rounded-[4px]", className)}
          style={{ background: colour.code }}
          {...props}
        />
      </div>
      <div className="flex flex-col items-start">
        <p className="txt-compact-xsmall-plus text-medusa-fg-basetext-start">
          {cssVarToTailwindClass(colour.name)}
        </p>
        <p className="txt-compact-xsmall text-medusa-fg-subtle">
          {colour.code}
        </p>
      </div>
    </div>
  )
}

const cssVarToTailwindClass = (name: string) => {
  if (name.startsWith("--bg") || name.startsWith("--button")) {
    return name.replace("-", "bg-ui")
  }

  if (name.startsWith("--fg")) {
    return name.replace("-", "text-ui")
  }

  if (name.startsWith("--border")) {
    return name.replace("-", "border-ui")
  }

  if (name.startsWith("--tag")) {
    if (name.includes("bg")) {
      return name.replace("-", "bg-ui")
    }
    if (name.includes("border")) {
      return name.replace("-", "border-ui")
    }
    if (name.includes("icon") || name.includes("text")) {
      return name.replace("-", "text-ui")
    }
  }

  if (name.startsWith("--contrast") || name.startsWith("--alpha")) {
    return name.replace("-", "bg-ui")
  }

  return name
}

const transformPrefixToTitle = (prefix: string) => {
  switch (prefix) {
    case "bg":
      return "Background"
    case "fg":
      return "Foreground"
    default:
      return prefix.charAt(0).toUpperCase() + prefix.slice(1)
  }
}

const getDescriptionOfSection = (title: string) => {
  switch (title) {
    case "Alpha":
    case "Contrast":
      return "These colors can be used for foreground (using `text-` prefix), background (using `bg-` prefix), and border (using `border-` prefix) elements."
    default:
      return ""
  }
}

const Colors = () => {
  const { colorMode } = useColorMode()

  const colors: ColorsTable = {}

  for (const [tag, value] of Object.entries(allColors[colorMode])) {
    const prefixMatch = tag.match(/(--[a-zA-Z]+)/gi)
    if (!prefixMatch) {
      return
    }
    const prefix = transformPrefixToTitle(prefixMatch[0].replace("--", ""))
    if (!colors[prefix]) {
      colors[prefix] = {
        description: getDescriptionOfSection(prefix),
        colors: [],
      }
    }

    colors[prefix].colors.push({
      name: tag,
      code: value as string,
    })
  }

  const sortedSections = Object.entries(colors).sort((a, b) => {
    return a[0].localeCompare(b[0])
  })

  for (const [, sectionData] of sortedSections) {
    sectionData.colors.sort((a, b) => {
      return a.name < b.name ? -1 : 1
    })
  }

  return (
    <div>
      {sortedSections.map(([section, sectionData], index) => (
        <div className="mb-16" key={`colours-section-${section}`}>
          <H2 id={slugify(section)}>{section}</H2>
          {sectionData.description && (
            <MarkdownContent>{sectionData.description}</MarkdownContent>
          )}
          <div className="xs:grid-cols-2 mb-8 grid grid-cols-1 gap-4 gap-y-10 sm:grid-cols-3 ">
            {sectionData.colors.map((colour) => (
              <CopyButton
                text={cssVarToTailwindClass(colour.name)}
                key={`colours-section-${section}-${colour.name}`}
              >
                <ColorBlock colour={colour} />
              </CopyButton>
            ))}
          </div>
          {index !== sortedSections.length - 1 && <Hr />}
        </div>
      ))}
    </div>
  )
}

export { Colors }
