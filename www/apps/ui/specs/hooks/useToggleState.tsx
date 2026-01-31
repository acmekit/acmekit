import { HookTable } from "@/components/HookTable"

export const Props = () => {
  return (
    <HookTable
      props={[
        {
          value: "initial",
          type: "boolean",
          description: "The initial state of the toggle.",
          default: "false",
        },
      ]}
    />
  )
}

export const Return = () => {
  return (
    <HookTable
      props={[
        {
          value: "state",
          type: {
            type: "object",
            name: "StateData",
            shape:
              "[\n  state: boolean,\n  open: () => void,\n  close: () => void,\n  toggle: () => void\n]",
          },
        },
      ]}
      isReturn
    />
  )
}
