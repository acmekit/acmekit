import type { MDXComponents as MDXComponentsType } from "mdx/types"
import { MDXComponents as UiMdxComponents } from "docs-ui"
import Feedback from "../Feedback"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  Feedback,
}

export default MDXComponents
