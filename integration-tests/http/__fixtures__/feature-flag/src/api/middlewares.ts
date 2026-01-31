import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@acmekit/framework/http"
import { z } from "@acmekit/framework/zod"

const CustomPostSchema = z.object({
  foo: z.string(),
})

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/custom",
      middlewares: [validateAndTransformBody(CustomPostSchema)],
    },
  ],
})
