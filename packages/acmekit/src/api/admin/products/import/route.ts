import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"
import { HttpTypes } from "@acmekit/framework/types"
import { AcmeKitError } from "@acmekit/framework/utils"
import { importProductsWorkflow } from "@acmekit/core-flows"

/**
 * @deprecated use `POST /admin/products/imports` instead.
 */
export const POST = async (
  req: AuthenticatedAcmeKitRequest<HttpTypes.AdminImportProductRequest>,
  res: AcmeKitResponse<HttpTypes.AdminImportProductResponse>
) => {
  const input = req.file as Express.Multer.File

  if (!input) {
    throw new AcmeKitError(
      AcmeKitError.Types.INVALID_DATA,
      "No file was uploaded for importing"
    )
  }

  const { result, transaction } = await importProductsWorkflow(req.scope).run({
    input: {
      filename: input.originalname,
      fileContent: input.buffer.toString("utf-8"),
    },
  })

  res
    .status(202)
    .json({ transaction_id: transaction.transactionId, summary: result })
}
