import { AcmeKitRequest, AcmeKitResponse } from "@acmekit/framework"
import { ContainerRegistrationKeys } from "@acmekit/framework/utils"

export const GET = async (req: AcmeKitRequest, res: AcmeKitResponse) => {
  const config = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

  res.status(200).json({
    enabled:
      !!config.projectConfig.http.authMethodsPerActor?.user?.includes("cloud"),
  })
}
