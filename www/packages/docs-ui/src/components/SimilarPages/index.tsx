"use client"

import React from "react"
import { useSimilarPages } from "../../hooks"
import { H2 } from "../Heading"
import { MDXComponents } from "../MDXComponents"

const P = MDXComponents.p as React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
>
const Ul = MDXComponents.ul as React.FC<React.HTMLAttributes<HTMLUListElement>>
const Li = MDXComponents.li as React.FC<React.HTMLAttributes<HTMLLIElement>>
const A = MDXComponents.a as React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>

export const SimilarPages = () => {
  const similarPages = useSimilarPages()

  if (!similarPages.length) {
    return null
  }

  return (
    <div>
      <H2>Similar Pages</H2>
      <P>Maybe you&apos;re looking for:</P>
      <Ul>
        {similarPages.map((page) => (
          <Li key={page.id}>
            <A href={page.url}>{page.title}</A>
          </Li>
        ))}
      </Ul>
    </div>
  )
}
