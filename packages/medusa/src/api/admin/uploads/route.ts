import { uploadFilesWorkflow } from "/core-flows"
import {
  AuthenticatedMedusaRequest,
  AcmeKitResponse,
} from "/framework/http"
import { AcmeKitError } from "/framework/utils"
import { HttpTypes } from "/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminUploadFile>,
  res: AcmeKitResponse<HttpTypes.AdminFileListResponse>
) => {
  const input = req.files as Express.Multer.File[]

  if (!input?.length) {
    throw new AcmeKitError(
      AcmeKitError.Types.INVALID_DATA,
      "No files were uploaded"
    )
  }

  const { result } = await uploadFilesWorkflow(req.scope).run({
    input: {
      files: input?.map((f) => ({
        filename: f.originalname,
        mimeType: f.mimetype,
        content: f.buffer.toString("base64"),
        access: "public",
      })),
    },
  })

  res.status(200).json({ files: result })
}
