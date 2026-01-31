import { AcmeKitError } from "@acmekit/framework/utils"
import { Request, Response } from "express"

export function GET(req: Request, res: Response) {
  throw new AcmeKitError(AcmeKitError.Types.INVALID_DATA, "Failed")
}
