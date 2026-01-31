import { Price } from "@models"
import { defaultPricesData } from "./data"
import { SqlEntityManager } from "@acmekit/framework/mikro-orm/postgresql"
import { toMikroORMEntity } from "@acmekit/framework/utils"

export * from "./data"

export async function createPrices(
  manager: SqlEntityManager,
  pricesData: any[] = defaultPricesData
): Promise<Price[]> {
  const prices: Price[] = []

  for (let data of pricesData) {
    const price = manager.create(toMikroORMEntity(Price), data)
    prices.push(price)
  }

  await manager.persistAndFlush(prices)

  return prices
}
