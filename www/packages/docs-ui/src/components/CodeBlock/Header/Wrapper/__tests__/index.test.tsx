import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock data
const mockColorMode = "light"

// mock functions
const mockUseColorMode = vi.fn(() => ({
  colorMode: mockColorMode,
}))

// mock components
vi.mock("@/providers/ColorMode", () => ({
  useColorMode: () => mockUseColorMode(),
}))

import { CodeBlockHeaderWrapper } from "../index"

beforeEach(() => {
  mockUseColorMode.mockReturnValue({
    colorMode: mockColorMode,
  })
})

describe("render", () => {
  test("render with children, blockStyle loud, and colorMode light", () => {
    const { container } = render(
      <CodeBlockHeaderWrapper blockStyle="loud">Hello</CodeBlockHeaderWrapper>
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("bg-acmekit-contrast-bg-base")
    expect(wrapper).not.toHaveClass("bg-acmekit-bg-component")
    expect(wrapper).not.toHaveClass("border-acmekit-border-base")
  })

  test("render with children, blockStyle subtle, and colorMode light", () => {
    const { container } = render(
      <CodeBlockHeaderWrapper blockStyle="subtle">Hello</CodeBlockHeaderWrapper>
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("bg-acmekit-bg-component")
    expect(wrapper).not.toHaveClass("bg-acmekit-code-bg-header")
    expect(wrapper).not.toHaveClass("bg-acmekit-contrast-bg-base")
    expect(wrapper).toHaveClass("border-acmekit-border-base")
    expect(wrapper).not.toHaveClass("border-acmekit-code-border")
  })

  test("render with children, blockStyle subtle, and colorMode dark", () => {
    mockUseColorMode.mockReturnValue({
      colorMode: "dark",
    })
    const { container } = render(
      <CodeBlockHeaderWrapper blockStyle="subtle">Hello</CodeBlockHeaderWrapper>
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("bg-acmekit-code-bg-header")
    expect(wrapper).not.toHaveClass("bg-acmekit-bg-component")
    expect(wrapper).not.toHaveClass("bg-acmekit-contrast-bg-base")
    expect(wrapper).not.toHaveClass("border-acmekit-border-base")
    expect(wrapper).toHaveClass("border-acmekit-code-border")
  })
})
