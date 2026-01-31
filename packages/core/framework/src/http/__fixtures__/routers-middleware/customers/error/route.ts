import { Request, Response } from "express"
import { AcmeKitError } from "@acmekit/utils"

export const GET = async (req: Request, res: Response) => {
  throw new AcmeKitError(AcmeKitError.Types.NOT_ALLOWED, "Not allowed")
}
