import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework/http"
import { defineFileConfig, FeatureFlag } from "@acmekit/utils"

defineFileConfig({
  isDisabled: () => !FeatureFlag.isFeatureEnabled("custom_ff"),
})

export const GET = async (req: AcmeKitRequest, res: AcmeKitResponse) => {
  res.json({ message: "Custom GET" })
}

export const POST = async (req: AcmeKitRequest, res: AcmeKitResponse) => {
  res.json({ message: "Custom POST", body: req.validatedBody })
}
