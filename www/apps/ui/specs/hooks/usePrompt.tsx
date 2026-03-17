import { HookTable } from "@/components/HookTable"

export const Return = () => {
  return (
    <HookTable
      props={[
        {
          value: "dialog",
          type: {
            type: "function",
            signature: `async (props: PromptProps): Promise<boolean>`,
          },
          description:
            "Async function used to display a new confirmation dialog.",
        },
      ]}
      isReturn
    />
  )
}
