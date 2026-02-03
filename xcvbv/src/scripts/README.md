# Custom CLI Script

A custom CLI script is a function to execute through Acmekit's CLI tool. This is useful when creating custom Acmekit tooling to run as a CLI tool.

> Learn more about custom CLI scripts in [this documentation](https://docs.acmekitjs.com/learn/fundamentals/custom-cli-scripts).

## How to Create a Custom CLI Script?

To create a custom CLI script, create a TypeScript or JavaScript file under the `src/scripts` directory. The file must default export a function.

For example, create the file `src/scripts/my-script.ts` with the following content:

```ts title="src/scripts/my-script.ts"
import { ExecArgs } from "@acmekit/framework/types"
import { ContainerRegistrationKeys } from "@acmekit/framework/utils"

export default async function myScript ({
  container
}: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Custom script ran successfully")
}
```

The function receives as a parameter an object having a `container` property, which is an instance of the Acmekit Container. Use it to resolve resources in your Acmekit application.

---

## How to Run Custom CLI Script?

To run the custom CLI script, run the `exec` command:

```bash
npx acmekit exec ./src/scripts/my-script.ts
```

---

## Custom CLI Script Arguments

Your script can accept arguments from the command line. Arguments are passed to the function's object parameter in the `args` property.

For example:

```ts
import { ExecArgs } from "@acmekit/framework/types"

export default async function myScript ({
  args
}: ExecArgs) {
  console.log(`The arguments you passed: ${args}`)
}
```

Then, pass the arguments in the `exec` command after the file path:

```bash
npx acmekit exec ./src/scripts/my-script.ts arg1 arg2
```