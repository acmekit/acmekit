import { CreateCartDTO, InferEntityType } from "@acmekit/framework/types"
import { SqlEntityManager } from "@acmekit/framework/mikro-orm/postgresql"
import { Cart } from "../../../src/models"
import { defaultCartsData } from "./data"
import { toMikroORMEntity } from "@acmekit/framework/utils"

export * from "./data"

export async function createCarts(
  manager: SqlEntityManager,
  cartsData: CreateCartDTO[] = defaultCartsData
): Promise<InferEntityType<typeof Cart>[]> {
  const carts: InferEntityType<typeof Cart>[] = []

  for (let cartData of cartsData) {
    let cart = manager.create(toMikroORMEntity(Cart), cartData)

    await manager.persistAndFlush(cart)
  }

  return carts
}
