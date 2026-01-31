import type { MDXComponents as MDXComponentsType } from "mdx/types"
import {
  MDXComponents as UiMdxComponents,
  TypeList,
  WorkflowDiagram,
  SourceCodeLink,
  CodeTabs,
  CodeTab,
  Table,
  Badge,
  Tooltip,
  CopyGeneratedSnippetButton,
  BadgesList,
  InjectedMDXData,
} from "docs-ui"
import { CommerceModuleSections } from "../CommerceModuleSections"
import { EventHeader } from "../EventHeader"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  TypeList,
  WorkflowDiagram,
  CommerceModuleSections,
  SourceCodeLink,
  CodeTabs,
  CodeTab,
  Table,
  Badge,
  Tooltip: (props) => {
    return <Tooltip {...props} />
  },
  EventHeader,
  CopyGeneratedSnippetButton,
  BadgesList,
  InjectedMDXData,
}

export default MDXComponents
