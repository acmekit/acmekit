import React from "react"
import { ErrorPageIcon } from "./Icon"
import Link from "next/link"
import { Button } from "../Button"
import { GITHUB_ISSUES_LINK } from "../../constants"

export const ErrorPage = () => {
  return (
    <div className="w-full h-full bg-medusa-bg-subtle flex items-center justify-center">
      <div className="flex gap-docs_1.5 flex-col items-center justify-center w-fit max-w-lg">
        <ErrorPageIcon />
        <div className="flex flex-col items-center gap-docs_0.5">
          <h1 className="text-medusa-fg-base text-2xl">
            Oops! Something went wrong.
          </h1>
          <span className="text-medusa-fg-subtle txt-large-plus text-pretty text-center">
            Don’t worry. Our team have automatically been notified of this issue
            and they are working on it. Please try again later.
          </span>
        </div>
        <div className="flex items-center justify-center gap-docs_0.75">
          <Link href={GITHUB_ISSUES_LINK} target="_blank" rel="noreferrer">
            <Button variant="secondary">Report issue</Button>
          </Link>
          <Link href="/" passHref>
            <Button variant="primary">Go to homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
