import { Entity, Property } from "@acmekit/deps/mikro-orm/core"

@Entity()
export class EntityModel {
  @Property({ columnType: "int" })
  id!: number
}
