import { CodeBlock } from "@acmekit/ui"

const snippets = [
  {
    label: "AcmeKit JS SDK",
    language: "jsx",
    code: `console.log("Hello, World!")`,
  },
]

export default function CodeBlockNoHeader() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}
