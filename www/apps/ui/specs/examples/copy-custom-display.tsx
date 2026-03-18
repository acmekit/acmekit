import { Code, Copy } from "@acmekit/ui"

export default function CopyDemo() {
  return (
    <Copy content="yarn add /ui">
      <Code>yarn add /ui</Code>
    </Copy>
  )
}
