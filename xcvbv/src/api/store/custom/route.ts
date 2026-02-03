import { AcmekitRequest, AcmekitResponse } from "@acmekit/framework/http";

export async function GET(
  req: AcmekitRequest,
  res: AcmekitResponse
) {
  res.sendStatus(200);
}
