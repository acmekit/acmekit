import { AcademicCapSolid, BookOpen } from "@medusajs/icons"
import clsx from "clsx"
import { CardList, H1, H2, MDXComponents, SimilarPages } from "docs-ui"
import { config } from "../config"

const P = MDXComponents.p as React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
>
const A = MDXComponents.a as React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>

const NotFoundPage = () => {
  return (
    <div
      className={clsx(
        "w-full h-fit",
        "max-w-inner-content-xs sm:max-w-inner-content-sm md:max-w-inner-content-md",
        "lg:max-w-inner-content-lg xl:max-w-inner-content-xl xxl:max-w-inner-content-xxl",
        "xxxl:max-w-inner-content-xxxl",
        "px-docs_1 md:px-docs_4"
      )}
    >
      <H1>Page Not Found</H1>
      <P>The page you were looking for isn&apos;t available.</P>
      <P>
        If you&apos;re looking for Medusa v1 documentation, it&apos;s been moved
        to <A href="https://docs.medusajs.com/v1">docs.medusajs.com/v1</A>.
      </P>
      <P>
        If you think this is a mistake, please{" "}
        <A href="https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml">
          report this issue on GitHub
        </A>
        .
      </P>
      <SimilarPages />
      <H2>Other Resources</H2>
      <CardList
        itemsPerRow={2}
        items={[
          {
            title: "Get Started Docs",
            href: `${config.baseUrl}/learn`,
            icon: BookOpen,
          },
          {
            title: "Commerce Modules",
            href: `${config.baseUrl}/resources/commerce-modules`,
            icon: AcademicCapSolid,
          },
        ]}
      />
    </div>
  )
}

export default NotFoundPage
