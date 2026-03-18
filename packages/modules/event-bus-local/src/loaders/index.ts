import { LoaderOptions } from "@acmekit/framework/types"

export default async ({ logger }: LoaderOptions): Promise<void> => {
  logger?.warn(
    "Local Event Bus installed. This is not recommended for production."
  )
}
