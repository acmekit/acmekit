import { GraphQLUtils } from "@acmekit/utils"

export function getEntitiesMap(loadedSchema): Map<string, any> {
  const defaultAcmeKitSchema = `
    scalar DateTime
    scalar JSON
  `
  const { schema } = GraphQLUtils.cleanGraphQLSchema(
    defaultAcmeKitSchema + loadedSchema
  )
  const mergedSchema = GraphQLUtils.mergeTypeDefs(schema)
  return GraphQLUtils.makeExecutableSchema({
    typeDefs: mergedSchema,
  }).getTypeMap() as any
}
