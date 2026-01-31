type ApiType = "store" | "admin" | "combined"

type CircularReferenceSchema = Record<string, string[]>

type CircularReferenceConfig = {
  decorators: {
    "acmekit/circular-patch": {
      schemas: CircularReferenceSchema
    }
  }
}
