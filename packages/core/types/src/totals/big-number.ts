/**
 * Raw value storage for precise decimal numbers (e.g. currency).
 */
export interface BigNumberRawValue {
  value: string
  precision?: number
}

/**
 * Acceptable input for big number (number, string, or raw value).
 */
export type BigNumberInput = number | string | BigNumberRawValue

/**
 * Big number interface for precise decimal arithmetic (kernel).
 */
export interface IBigNumber {
  readonly numeric: number
  readonly raw: BigNumberRawValue | undefined
  setRawValueOrThrow(
    rawValue: BigNumberInput | unknown,
    options?: { precision?: number }
  ): void
}
