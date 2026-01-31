import { AcmeKitContainer } from "@acmekit/types"

export default async function handler(container: AcmeKitContainer) {
  console.log(`You have received 5 orders today`)
}

export const config = {
  name: "summarize-orders",
  schedule: "* * * * * *",
  numberOfExecutions: 2,
}
