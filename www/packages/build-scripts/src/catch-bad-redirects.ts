import type { NextConfig } from "next"

type CatchBadRedirectsOptions = Awaited<
  ReturnType<NonNullable<NextConfig["redirects"]>>
>

export const catchBadRedirects = (redirects: CatchBadRedirectsOptions) => {
  for (const redirect of redirects) {
    if (redirect.source === redirect.destination) {
      throw new Error(
        `Redirect source and destination are the same: ${JSON.stringify(redirect, null, 2)}`
      )
    }
  }

  return redirects
}
