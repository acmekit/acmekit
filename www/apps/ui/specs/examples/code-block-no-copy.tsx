import { CodeBlock, Label } from "@medusajs/ui"

const snippets = [
  {
    label: "Medusa JS SDK",
    language: "jsx",
    code: `console.log("Hello, World!")`,
    hideCopy: true,
  },
]

export default function CodeBlockNoCopy() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Header>
          <CodeBlock.Header.Meta>
            <Label weight={"plus"}>/product-detail.js</Label>
          </CodeBlock.Header.Meta>
        </CodeBlock.Header>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}
