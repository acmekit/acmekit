import { CodeBlock, Label } from "@medusajs/ui"

const snippets = [
  {
    label: "Medusa JS SDK",
    language: "jsx",
    code: `console.log("Hello, ")\n\nconsole.log("World!")`,
    hideLineNumbers: true,
  },
]

export default function CodeBlockNoLines() {
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
