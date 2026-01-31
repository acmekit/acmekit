  import * as React from "react"
  import { cleanup, render, screen } from "@testing-library/react"

  import AcmeKit from "../acmekit"

  describe("AcmeKit", () => {
    it("should render the icon without errors", async () => {
      render(<AcmeKit data-testid="icon" />)


      const svgElement = screen.getByTestId("icon")

      expect(svgElement).toBeInTheDocument()

      cleanup()
    })
  })