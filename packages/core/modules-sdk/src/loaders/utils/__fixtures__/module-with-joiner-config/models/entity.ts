import { Entity, Property } from "@medusajs/deps/mikro-orm/core"

@Entity()
export class EntityModel {
  @Property({ columnType: "int" })
  id!: number
}
