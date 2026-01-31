"use client"

import React from "react"
import { SearchSuggestionType } from "../../Search/Suggestions"
import { SearchHitGroupName } from "../../Search/Hits/GroupName"
import { SearchSuggestionItem } from "../../Search/Suggestions/Item"
import { useChat } from "@kapaai/react-sdk"
import { Link } from "../../Link"
import { useSiteConfig } from "../../../providers/SiteConfig"

type AiAssistantSuggestionsProps = React.AllHTMLAttributes<HTMLDivElement>

export const AiAssistantSuggestions = (props: AiAssistantSuggestionsProps) => {
  const {
    config: { baseUrl },
  } = useSiteConfig()
  const { submitQuery } = useChat()
  const suggestions: SearchSuggestionType[] = [
    {
      title: "FAQ",
      items: [
        "What is AcmeKit?",
        "How can I create a module?",
        "How can I create a data model?",
        "How do I create a workflow?",
        "How can I extend a data model in the Product Module?",
      ],
    },
    {
      title: "Recipes",
      items: [
        "How do I build a marketplace with AcmeKit?",
        "How do I build digital products with AcmeKit?",
        "How do I build subscription-based purchases with AcmeKit?",
        "What other recipes are available in the AcmeKit documentation?",
      ],
    },
  ]

  return (
    <div {...props}>
      <span className="text-acmekit-fg-muted text-compact-small px-docs_0.5 py-docs_0.75 block">
        For assistance in your development, use{" "}
        <Link
          href={`${baseUrl}/learn/introduction/build-with-llms-ai#claude-code-plugins`}
          variant="content"
        >
          Claude Code Plugins
        </Link>{" "}
        or{" "}
        <Link
          href={`${baseUrl}/learn/introduction/build-with-llms-ai#mcp-remote-server`}
          variant="content"
        >
          AcmeKit MCP server
        </Link>{" "}
        in Cursor, VSCode, etc...
      </span>
      {suggestions.map((suggestion, index) => (
        <React.Fragment key={index}>
          <SearchHitGroupName name={suggestion.title} />
          {suggestion.items.map((item, itemIndex) => (
            <SearchSuggestionItem
              onClick={() => {
                submitQuery(item)
              }}
              key={itemIndex}
              tabIndex={itemIndex}
            >
              {item}
            </SearchSuggestionItem>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}
