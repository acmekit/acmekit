import { Entity, Property } from "@medusajs/deps/mikro-orm/core"

@Entity()
export class Entity2 {
  @Property({ columnType: "int" })
  id!: number
}
