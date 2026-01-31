import { ulid } from "ulid"
import { MIMEType } from "util"
import type {
  AcmeKitResponse,
  AuthenticatedAcmeKitRequest,
} from "@acmekit/framework/http"
import {
  Modules,
  AcmeKitError,
  AcmeKitErrorTypes,
} from "@acmekit/framework/utils"
import type { HttpTypes } from "@acmekit/framework/types"
import type { AdminUploadPreSignedUrlType } from "../validators"

export const POST = async (
  req: AuthenticatedAcmeKitRequest<AdminUploadPreSignedUrlType>,
  res: AcmeKitResponse<HttpTypes.AdminUploadPreSignedUrlResponse>
) => {
  const fileProvider = req.scope.resolve(Modules.FILE)
  let type: MIMEType

  try {
    type = new MIMEType(req.validatedBody.mime_type)
  } catch {
    throw new AcmeKitError(
      AcmeKitErrorTypes.INVALID_DATA,
      `Invalid file type "${req.validatedBody.mime_type}"`,
      AcmeKitErrorTypes.INVALID_DATA
    )
  }

  const extension = type.subtype
  const uniqueFilename = `${ulid()}.${extension}`

  const response = await fileProvider.getUploadFileUrls({
    filename: uniqueFilename,
    mimeType: req.validatedBody.mime_type,
    access: req.validatedBody.access ?? "private",
  })

  res.json({
    url: response.url,
    filename: response.key,
    mime_type: type.toString(),
    size: req.validatedBody.size,
    extension,
    originalname: req.validatedBody.originalname,
  })
}
