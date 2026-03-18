import { asClass, asValue } from "@acmekit/framework/awilix"
import { RedisDistributedTransactionStorage } from "../utils"

export default async ({ container, dataLoaderOnly }): Promise<void> => {
  container.register({
    redisDistributedTransactionStorage: asClass(
      RedisDistributedTransactionStorage
    ).singleton(),
    dataLoaderOnly: asValue(!!dataLoaderOnly),
  })
}
