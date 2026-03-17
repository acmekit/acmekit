import {
  subscriberSnippetGenerator,
  SubscriberSnippetGeneratorOptions,
} from "./snippet-generators/subscriber"

export type UseGenerateSnippet = {
  type: "subscriber"
  options: SubscriberSnippetGeneratorOptions
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generators: Record<string, (options: any) => string> = {
  subscriber: subscriberSnippetGenerator,
}

export const useGenerateSnippet = ({ type, options }: UseGenerateSnippet) => {
  const snippet = generators[type](options)

  return {
    snippet,
  }
}
