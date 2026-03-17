"use client"

import { SearchProvider as UiSearchProvider } from "docs-ui"
import { config } from "../config"

type SearchProviderProps = {
  children: React.ReactNode
}

const SearchProvider = ({ children }: SearchProviderProps) => {
  return (
    <UiSearchProvider
      algolia={{
        appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "temp",
        apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || "temp",
        mainIndexName:
          process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
      }}
      indices={[
        {
          value: process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp",
          title: "Docs",
        },
        {
          value: process.env.NEXT_PUBLIC_API_ALGOLIA_INDEX_NAME || "temp",
          title: "Store & Admin API",
        },
      ]}
      defaultIndex={process.env.NEXT_PUBLIC_DOCS_ALGOLIA_INDEX_NAME || "temp"}
      searchProps={{
        isLoading: false,
        suggestions: [
          {
            title: "Getting started? Try one of the following terms.",
            items: [
              "Install Medusa with create-medusa-app",
              "What is an API route?",
              "What is a Module?",
              "What is a Workflow?",
            ],
          },
          {
            title: "Developing with Medusa",
            items: [
              "How to create a Module",
              "How to create an API route",
              "How to create a data model",
              "How to create an admin widget",
            ],
          },
        ],
        checkInternalPattern: new RegExp(
          `^${config.baseUrl}/([^(resources)])*`
        ),
      }}
    >
      {children}
    </UiSearchProvider>
  )
}

export default SearchProvider
