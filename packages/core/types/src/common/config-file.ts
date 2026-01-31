/**
 * The configuration accepted by the "defineFileConfig" helper
 */
export type InputFileConfig = {
  path?: string
  isDisabled(): boolean
}
