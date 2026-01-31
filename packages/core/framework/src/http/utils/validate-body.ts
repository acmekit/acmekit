import { z } from "@acmekit/deps/zod"
import { NextFunction } from "express"
import { AcmeKitRequest, AcmeKitResponse } from "../types"
import { zodValidator } from "../../zod"

export function validateAndTransformBody(
  zodSchema:
    | z.ZodObject<any, any>
    | z.ZodEffects<any, any>
    | ((
        customSchema?: z.ZodOptional<z.ZodNullable<z.ZodObject<any, any>>>
      ) => z.ZodObject<any, any> | z.ZodEffects<any, any>)
): (
  req: AcmeKitRequest,
  res: AcmeKitResponse,
  next: NextFunction
) => Promise<void> {
  return async function validateBody(
    req: AcmeKitRequest,
    _: AcmeKitResponse,
    next: NextFunction
  ) {
    try {
      let schema: z.ZodObject<any, any> | z.ZodEffects<any, any>
      if (typeof zodSchema === "function") {
        schema = zodSchema(req.additionalDataValidator)
      } else {
        schema = zodSchema
      }

      req.validatedBody = await zodValidator(schema, req.body)
      next()
    } catch (e) {
      next(e)
    }
  }
}
