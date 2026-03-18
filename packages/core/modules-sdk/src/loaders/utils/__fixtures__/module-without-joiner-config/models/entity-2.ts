import { Entity, Property } from "@acmekit/deps/mikro-orm/core"

@Entity()
export class Entity2 {
  @Property({ columnType: "int" })
  id!: number
}
