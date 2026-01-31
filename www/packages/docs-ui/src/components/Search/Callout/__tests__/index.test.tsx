import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"

// mock functions
const mockUseAcmeKitSuggestions = vi.fn((options) => null as unknown)
const mockUseInstantSearch = vi.fn(() => ({
  results: {
    query: "test",
  },
}))
const mockTrack = vi.fn()

// mock components and hooks
vi.mock("@/hooks/use-acmekit-suggestions", () => ({
  useAcmeKitSuggestions: (options: unknown) => mockUseAcmeKitSuggestions(options),
}))
vi.mock("@/components/Card", () => ({
  Card: (props: { title: string, onClick: () => void }) => (
    <div data-testid="card" onClick={props.onClick}>{props.title}</div>
  ),
}))
vi.mock("react-instantsearch", () => ({
  useInstantSearch: () => mockUseInstantSearch(),
}))
vi.mock("@/providers/Analytics", () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}))

import { SearchCallout } from "../index"
import { DocsTrackingEvents } from "../../../../constants"

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("render", () => {
  test("should not render when there is no matched suggestion", () => {
    mockUseAcmeKitSuggestions.mockReturnValueOnce(null)

    const { container } = render(<SearchCallout />)

    expect(container.firstChild).toBeNull()
  })
  
  test("should render when there is a matched suggestion", () => {
    const mockCardProps = {
      title: "Test Card",
      text: "This is a test card.",
      href: "https://example.com",
      icon: () => <div>Icon</div>,
    }
    mockUseAcmeKitSuggestions.mockReturnValueOnce(mockCardProps)

    const { getByTestId } = render(<SearchCallout />)

    expect(getByTestId("card")).toBeInTheDocument()
    expect(getByTestId("card")).toHaveTextContent("Test Card")
  })

  test("should not render when there is no query", () => {
    mockUseInstantSearch.mockReturnValueOnce({
      results: {
        query: "",
      },
    })
    mockUseAcmeKitSuggestions.mockReturnValueOnce(null)

    const { container } = render(<SearchCallout />)

    expect(container.firstChild).toBeNull()
  })

  test("should call useAcmeKitSuggestions with the correct query", () => {
    render(<SearchCallout />)

    expect(mockUseAcmeKitSuggestions).toHaveBeenCalledWith({
      keywords: "test",
    })
  })
})

describe("interaction", () => {
  test("should track click event when card is clicked", () => {
    const mockCardProps = {
      title: "Test Card",
      text: "This is a test card.",
      href: "https://example.com",
      icon: () => <div>Icon</div>,
    }
    mockUseAcmeKitSuggestions.mockReturnValueOnce(mockCardProps)

    const { getByTestId } = render(<SearchCallout />)

    const cardElement = getByTestId("card")
    expect(cardElement).toBeInTheDocument()

    // Simulate click
    fireEvent.click(cardElement!)

    expect(mockTrack).toHaveBeenCalledWith({
      event: {
        event: DocsTrackingEvents.SEARCH_CALLOUT_CLICK,
        options: {
          user_keywords: "test",
          callout_title: mockCardProps.title,
          callout_href: mockCardProps.href,
        },
      },
    })
  })
})