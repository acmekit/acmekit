import { BigNumber } from "../../totals/big-number"
import { BaseProperty } from "./base"

/**
 * The NumberProperty is used to define a numeric/integer
 * property
 */
export class BigNumberProperty extends BaseProperty<number> {
  protected dataType = {
    name: "bigNumber",
  } as const

  static isBigNumberProperty(obj: any): obj is BigNumberProperty {
    return obj?.dataType?.name === "bigNumber"
  }

  default(value: number | string | BigNumber) {
    super.default(value as number)
    return this
  }
}
