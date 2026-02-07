export type ApiType = "client" | "admin" | "combined"

export type CircularReferenceSchema = Record<string, string[]>

export type CircularReferenceConfig = {
  decorators: {
    "acmekit/circular-patch": {
      schemas: CircularReferenceSchema
    }
  }
}
