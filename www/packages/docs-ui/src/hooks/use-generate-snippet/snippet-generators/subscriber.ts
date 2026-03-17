import { parseEventPayload } from "../../../utils"

export type SubscriberSnippetGeneratorOptions = {
  event: string
  payload: Record<string, unknown> | string
}

export const subscriberSnippetGenerator = ({
  event,
  payload: initialPayload,
}: SubscriberSnippetGeneratorOptions) => {
  const payload =
    typeof initialPayload === "string"
      ? parseEventPayload(initialPayload).payload_for_snippet
      : initialPayload
  // format subscriber name
  const subscriberName =
    event
      .split(".")
      .map((word) =>
        word.replace(/-./g, (match) => match.charAt(1).toUpperCase())
      )
      .map((word, index) => {
        if (index === 0) {
          return word.charAt(0).toLowerCase() + word.slice(1)
        }

        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join("") + "Handler"
  // format payload
  const payloadType: Record<string, unknown> = {}
  Object.keys(payload).forEach((key) => {
    const value = payload[key]
    if (Array.isArray(value)) {
      payloadType[key] = `${typeof value[0]}[]`
    } else {
      payloadType[key] = typeof value
    }
  })

  const payloadString = JSON.stringify(payloadType, null, 2).replaceAll(
    /"/g,
    ""
  )

  // return the snippet
  return subscriberSnippet
    .replace("{{subscriberName}}", subscriberName)
    .replace("{{event}}", event)
    .replace("{{payload}}", payloadString)
}

const subscriberSnippet = `import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function {{subscriberName}}({
  event: { data },
  container,
}: SubscriberArgs<{{payload}}>) {
  // TODO handle event
}

export const config: SubscriberConfig = {
  event: "{{event}}",
}`
