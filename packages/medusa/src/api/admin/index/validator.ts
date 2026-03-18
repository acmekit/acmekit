import { z } from "@acmekit/framework/zod"

export const AdminIndexSyncPayload = z.object({
  strategy: z.enum(["full", "reset"]).optional(),
})
