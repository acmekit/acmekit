import {
  AuthenticatedAcmeKitRequest,
  AcmeKitResponse,
} from "@acmekit/framework/http"

export const POST = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  req.session.auth_context = req.auth_context

  res.status(200).json({ user: req.auth_context })
}

export const DELETE = async (
  req: AuthenticatedAcmeKitRequest,
  res: AcmeKitResponse
) => {
  req.session.destroy()
  res.json({ success: true })
}
