import { OpenAPI } from "types"

export function parseEventPayload(payloadStr: string) {
  const payloadParams = payloadStr.matchAll(/([\w_]+),? \/\/ (\(\w*\) )*(.*)/g)
  const payloadForSnippet: Record<string, unknown> = {}
  const payload = Array.from(payloadParams).map((match) => {
    const name = match[1]
    const type = (match[2]?.replace(/\(|\)/g, "") || "string").trim()
    const description = match[3]

    if (type === "string") {
      payloadForSnippet[name] = "test"
    } else if (type === "number") {
      payloadForSnippet[name] = 1
    } else if (type === "boolean") {
      payloadForSnippet[name] = true
    } else if (type === "object") {
      payloadForSnippet[name] = {}
    } else if (type === "array") {
      payloadForSnippet[name] = [{}]
    }

    return {
      name,
      type,
      description,
    }
  })
  return {
    parsed_payload: {
      type: "object",
      required: ["payload"],
      properties: {
        payload: {
          type: "object",
          description: "The payload emitted with the event",
          required: [...payload.map((param) => param.name)],
          properties: payload.reduce(
            (acc, curr) => {
              acc[curr.name] = {
                type: curr.type as OpenAPI.OpenAPIV3.NonArraySchemaObjectType,
                description: curr.description,
                properties: {},
              }
              return acc
            },
            {} as Record<string, OpenAPI.SchemaObject>
          ),
        },
      },
    } as OpenAPI.SchemaObject,
    payload_for_snippet: payloadForSnippet,
  }
}
