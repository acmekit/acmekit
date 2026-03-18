import { FlagSettings } from "@acmekit/framework/feature-flags"

export const CustomFeatureFlag: FlagSettings = {
  key: "custom_ff",
  default_val: false,
  env_key: "CUSTOM_FF",
  description: "Custom feature flag",
}
