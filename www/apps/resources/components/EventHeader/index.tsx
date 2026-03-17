"use client"

import { Brackets, CheckCircle, SquareTwoStack, Tag } from "@medusajs/icons"
import {
  DropdownMenu,
  H2,
  H2Props,
  H3,
  H3Props,
  useCopy,
  useGenerateSnippet,
} from "docs-ui"

type EventHeaderProps = (
  | {
      headerLvl: "2"
      headerProps: H2Props
    }
  | {
      headerLvl: "3"
      headerProps: H3Props
    }
) & {
  eventName: string
  payload: string
}

export const EventHeader = ({
  headerLvl,
  headerProps,
  eventName,
  payload: payloadStr,
}: EventHeaderProps) => {
  const Header = headerLvl === "2" ? H2 : H3
  const { snippet } = useGenerateSnippet({
    type: "subscriber",
    options: {
      event: eventName,
      payload: payloadStr,
    },
  })
  const { handleCopy: handleEventNameCopy, isCopied: eventNameCopied } =
    useCopy(eventName)
  const { handleCopy: handleSnippetCopy, isCopied: snippetCopied } =
    useCopy(snippet)

  return (
    <div className="flex items-center justify-between flex-wrap">
      <Header {...headerProps}>{headerProps.children ?? eventName}</Header>
      <DropdownMenu
        dropdownButtonContent={
          <>
            {eventNameCopied || snippetCopied ? (
              <CheckCircle />
            ) : (
              <SquareTwoStack />
            )}
          </>
        }
        menuItems={[
          {
            type: "action",
            title: "Copy event name",
            action: () => handleEventNameCopy(),
            icon: <Tag />,
          },
          {
            type: "action",
            title: "Copy subscriber for event",
            action: () => handleSnippetCopy(),
            icon: <Brackets />,
          },
        ]}
        menuClassName="z-10"
      />
    </div>
  )
}
