import { CodeBlock, Label } from "@medusajs/ui"

const snippets = [
  {
    label: "Medusa JS SDK",
    language: "jsx",
    code: `console.log("Hello, World!")`,
  },
]

export default function CodeBlockSingle() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Header hideLabels={true}>
          <CodeBlock.Header.Meta>
            <Label weight={"plus"}>/product-detail.js</Label>
          </CodeBlock.Header.Meta>
        </CodeBlock.Header>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}
